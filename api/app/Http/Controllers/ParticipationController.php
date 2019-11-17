<?php

namespace App\Http\Controllers;

use App\Event;
use App\Invitation;
use App\Mail\Email;
use App\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Mail;
use Laravel\Lumen\Routing\Controller;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;

class ParticipationController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth');
    }


    public function add(Request $request)
    {
        $event = Event::find($request->event_id);

        if($event == null){
            return response()->json(["Error" => "No content"], 400);
        }

        $user = Auth::user();

        if($event->isParticipant($user->id)){
            return response()->json(["Error" => "Already rolled in"], 400);
        }

        if($event->slots_available == 0)
            return response()->json(["Error" => "All slots are taken"], 400);

        try
        {
            $event->decrement('slots_available');
            $user->participations()->attach($event->id);

            $invitation = Invitation::find( [$request->invited_user_id,  $request->event_id]);

            if(!empty($invitation)) {
                $invitation->accepted = true;
                $invitation->update();
            }

            return response()->json(['status' => 'OK'], 200);
        }
        catch (QueryException $e)
        {
            return response()->json(["Error" =>  $e->getResponse()], $e->status);
        }
    }

    public function resign($event_id){

        $event = Event::findOrFail($event_id);
        if($event == null){
            return response()->json(["Error" => "No content"], 400);
        }

        $user = Auth::user();

        if (!$event->isParticipant($user->id)){
            return response()->json(["Error" => "Not a participant"], 403);
        }


        try
        {
            $event->increment('slots_available');
            $user->participations()->detach($event->id);
            return response()->json(['status' => 'OK'], 200);
        }
        catch (QueryException $e)
        {
            return response()->json(["Error" =>  $e->getResponse()], $e->status);
        }
    }

    public function delete(Request $request)
    {

        $event = Event::findOrFail($request->event_id);
        if($event == null){
            return response()->json(["Error" => "No content"], 400);
        }

        if (Gate::denies('delete-event', $event)) {
            return response()->json(["Error" => "Unauthorised"], 403);
        }


        $user = User::findOrFail($request->user_id);

        if (!$event->isParticipant($user->id)){
            return response()->json(["Error" => "Not a participant"], 400);
        }


        try
        {
            $event->increment('slots_available');
            $user->participations()->detach($event->id);

            Mail::send(new Email(
                "statement",
                "usunięcie z wydarzenia",
                $user->email,
                [
                    'userLogin' => $user->login,
                    'content' =>
                        "Z przykrością informujemy, że autor wydarzenia: "
                        . $event->name . ' które odbywa się '
                        . $event->date . ' w '
                        . $event->adress_description
                        . " usunął Cię z listy uczestników. \n"
                ]));

            return response()->json(['status' => 'OK'], 200);
        }
        catch (QueryException $e)
        {
            return response()->json(["Error" =>  $e->getResponse()], $e->status);
        }
    }
}
