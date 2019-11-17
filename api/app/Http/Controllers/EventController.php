<?php

namespace App\Http\Controllers;

use App\Mail\Email;
use App\Resources\CommentResource;
use App\Resources\EventResource;
use App\Resources\EventShortenedResource;
use App\Resources\UserResource;
use App\Resources\UserShortResource;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;
use Laravel\Lumen\Routing\Controller;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use App\Event;
use Illuminate\Support\Facades\Gate;

class EventController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth',  ['only' => 'add','update','delete', 'getAllDetails','getParticipants', 'getComments']);
    }

    public function index()
    {
        $events = Event::where('date', '>=', Carbon::today())->where('blocked', false)->get();
        $response = Event::toShortenedResourceArray($events);

        return response()->json($response, 200);
    }


    public function add(Request $request)
    {
        try {
            $this->validate($request, [
                'name' => 'required|string',
                'description' => 'required|string',
                'date' => 'required|date',
                'time' => 'required|date_format:H:i',
                'slots_available' => 'required|integer|min:0',
                'slots_all' => 'required|integer|min:0',
                'category_id' => 'required|integer',
                'latitude' => 'required|regex:/^[0-9]+(\\.[0-9]+)?$/',
                'longitude' => 'required|regex:/^[0-9]+(\\.[0-9]+)?$/',
                'adress_description' => 'required|string'
            ]);
        }catch (ValidationException $e){
            return response()->json(["Error" =>  $e->getResponse()], $e->status);
        }


            $event = new Event();
            $event->name = $request->name;
            $event->description = $request->description;
            $event->date = $request->date;
            $event->time = $request->time;
            $event->slots_available = $request->slots_available;
            $event->slots_all = $request->slots_all;
            $event->category_id = $request->category_id;
            $event->author_id = Auth::user()->id;
            $event->latitude = $request->latitude;
            $event->longitude = $request->longitude;
            $event->adress_description = $request->adress_description;

            try
            {
                $event->save();
                return response()->json(['status' => 'OK'], 200);
            }
            catch (QueryException $e)
            {
                return response()->json(["Error" => ["database exception", $e]], 400);
            }
        }

    public function update($id, Request $request){

        $event = Event::findOrFail($id);

        if (Gate::denies('update-event', $event)) {
            return response()->json(["Error" => "Unauthorised"], 403);
        }

        try {
            $this->validate($request, [
                'name' => 'string',
                'description' => ' string',
                'date' => ' date',
                'time' => ' date_format:H:i',
                'slots_available' => ' integer|min:0',
                'slots_all' => ' integer|min:0',
                'category_id' => ' integer',
                'latitude' => 'regex:/^[0-9]+(\\.[0-9]+)?$/',
                'longitude' => 'regex:/^[0-9]+(\\.[0-9]+)?$/',
                'adress_description' => ' string'
            ]);
        }catch (ValidationException $e){
            return response()->json(["Error" =>  $e->getResponse()], $e->status);
        }

        if($request->has('name'))
            $event->name = $request->name;
        if($request->has('description'))
            $event->description = $request->description;
        if($request->has('date'))
            $event->date = $request->date;
        if($request->has('time'))
         $event->time = $request->time;
        if($request->has('slots_all')) {
            $event->slots_all = $request->slots_all;
            if ($request->has('slots_available')
                && $request->slots_all > $request->slots_available)
                $event->slots_available = $request->slots_available;
        }
        if($request->has('category_id'))
            $event->category_id = $request->category_id;
        if($request->has('latitude'))
         $event->latitude = $request->latitude;
        if($request->has('longitude'))
          $event->longitude = $request->longitude;
        if($request->has('adress_description'))
         $event->adress_description = $request->adress_description;


        try {
            $event->update();

            foreach ($event->participants as $participant) {

                Mail::send(new Email(
                    "link",
                    "aktualizacja wydarzenia",
                    $participant->email,
                    [
                        'userLogin' => $participant->login,
                        'function' => "event",
                        'hashedId' => $event->id,
                        'content' =>
                            "Wydarzenie w którym uczestniczysz zostało zaktualizowane: "
                            . $event->name . ' które odbywa się '
                            . $event->date . ' w '
                            . $event->adress_description
                            . "\n By zobaczyć szczegółowe informacje kliknij w ponizszy link:\n"
                    ]));


            }

            return response()->json(['status' => 'OK'], 200);
        } catch (QueryException $e) {
            return response()->json(["Error" => ["database exception", $e]], 400);
        }
    }


    public function getShortenedDetails($id)
    {
        $event = Event::findOrFail($id);
        if ($event->blocked){
            return response()->json(["Error" => "Event blocked"], 400);
        }
        return response()->json(new EventShortenedResource($event), 200);
    }

    public function getAllDetails($id)
    {
        $event = Event::findOrFail($id);
        if (Gate::denies('getDetails-event', $event)) {
            return response()->json(["Error" => "Unauthorised"], 403);
        }

        if ($event->blocked){
            return response()->json(["Error" => "Event blocked"], 400);
        }

        return response()->json(new EventResource($event), 200);
    }


    public function getParticipants($id)
    {
        $event = Event::findOrFail($id);

        if (Gate::denies('getDetails-event', $event)) {
            return response()->json(["Error" => "Unauthorised"], 403);
        }

        $users = $event->participants
                    ->map(function ($value) {
                        return new UserShortResource($value);
                    });

        return response()->json($users, 200);
    }

    public function getComments($id)
    {

        $event = Event::findOrFail($id);

        if (Gate::denies('getDetails-event', $event)) {
            return response()->json(["Error" => "Unauthorised"], 403);
        }

        $comments = $event->comments->map(function ($value) {
            return new CommentResource($value);
        });

        return response()->json($comments, 200);
    }


    public function delete($id)
    {
        $event = $event = Event::findOrFail($id);

        if (Gate::denies('delete-event', $event)) {
            return response()->json(["Error" => "Unauthorised"], 403);
        }

        try
        {
            foreach ($event->participants as $participant) {
                Mail::send(new Email(
                    "statement",
                    "wydarzenie zostało usunięte",
                    $participant->email,
                    [
                        'userLogin' => $participant->login,
                        'content' =>
                            "Z przykrością informujemy, że wydarzenie: "
                            . $event->name . ' które miało odbyć się '
                            . $event->date . ' w '
                            . $event->adress_description
                            . " zostało odwołane \n"
                    ]));
            }

            $event->delete();

            return response()->json(['status' => 'OK'], 200);
        }
        catch (QueryException $e)
        {
            return response()->json(["Error" => ["database exception", $e]], 400);
        }

    }


    // FILTERS


    public function findByCategory($id)
    {
        $events = Event::where("category_id", $id)->where('date', '>=', Carbon::today())->get();
        $response = Event::toShortenedResourceArray($events);

        return response()->json($response, 200);
    }

    public function findByDate($from, $to)
    {
        $events = Event::whereBetween('date', array($from, $to))->get();
        $response = Event::toShortenedResourceArray($events);

        return response()->json($response, 200);
    }

    public function findByAllSlots($from, $to)
    {
        $events = Event::whereBetween('slots_all', array($from, $to))->where('date', '>=', Carbon::today())->get();
        $response = Event::toShortenedResourceArray($events);
        return response()->json($response, 200);
    }


    public function findByAvailableSlots($from, $to)
    {
        $events = Event::whereBetween('slots_available', array($from, $to))->where('date', '>=', Carbon::today())->get();
        $response = Event::toShortenedResourceArray($events);

        return response()->json($response, 200);
    }

    public function findByName($name)
    {
        $events = Event::where("name", 'LIKE', '%'.$name.'%')->where('date', '>=', Carbon::today())->get();
        $response = Event::toShortenedResourceArray($events);

        return response()->json($response, 200);
    }

    public function findByAllFilters(Request $request)
    {
        $events = Event::query();

        if($request->slots_available_from != null && $request->slots_available_to != null){
            $events = $events
                ->whereBetween('slots_available',
                    array($request->slots_available_from, $request->slots_available_to));
        } else if($request->slots_available_from != null)
            $events = $events
                ->where('date', '>=', $request->slots_available_from);
        else if($request->slots_available_to != null)
            $events = $events
                ->where('date', '<=', $request->slots_available_to);



        if($request->slots_all_from != null && $request->slots_all_to != null){
            $events = $events
                ->whereBetween('slots_all',
                    array($request->slots_all_from, $request->slots_all_to));
        }  else if($request->slots_all_from != null)
            $events = $events
                ->where('date', '>=', $request->slots_all_from);
        else if($request->slots_all_to != null)
            $events = $events
                ->where('date', '<=', $request->slots_all_to);



        if($request->name != null)
            $events = $events->where("name", 'LIKE', '%'.$request->name.'%');



        if($request->date_from != null && $request->date_to != null) {
            $events = $events
                ->whereBetween('date', array($request->date_from, $request->date_to));
        } else if($request->date_from != null)
            $events = $events
                ->where('date', '>=', $request->date_from);
        else if($request->date_to != null)
            $events = $events
                ->where('date', '<=', $request->date_to);


        if($request->category_id != null)
            $events = $events
                -> where("category_id", $request->category_id);

        if ($request->slots_available_from == null && $request->slots_available_to == null &&
               $request->slots_all_from == null && $request->slots_all_to == null &&
                   $request->name == null &&
                      $request->date_from == null && $request->date_to == null &&
             $request->category_id == null)
            $events = Event::all();

        $events = $events->where('date', '>=', Carbon::today())->get();
        $response = Event::toShortenedResourceArray($events);

        return response()->json($response, 200);
    }


}
