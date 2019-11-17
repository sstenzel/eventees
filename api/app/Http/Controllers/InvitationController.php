<?php

namespace App\Http\Controllers;

use App\Event;
use App\Mail\Email;
use App\Resources\InvitationResource;
use App\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;
use Laravel\Lumen\Routing\Controller;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use App\Invitation;

class InvitationController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth');
    }


    public function get($id)
    {
        $event = Event::find($id);

        if($event == null){
            return response()->json(["Error" => "No content"], 400);
        }

        $user = Auth::user();

        $invitation = Invitation::find( [$user->id,  $id]);


        return response()->json(new InvitationResource($invitation),200);
    }

    public function add(Request $request) {

        try {
            $this->validate($request, [
                'login' => 'required|string',
                'event_id' => 'required|integer',
            ]);
        }catch (ValidationException $e){
            return response()->json(["Error" =>  $e->getResponse()], $e->status);
        }


        $event = Event::findOrFail($request->event_id);
        if (Gate::denies('add-invitation', $event)) {
            return response()->json(["Error" =>"Unauthorised"], 403);
        }

        $invited_user = User::where('login', $request->login)->first();

        $invitation = Invitation::find( [$invited_user->id,  $request->event_id]);

        if($invitation != null) {
            return response()->json(["Error" =>"Already exists"], 400);
        }

        $newInvitation = new Invitation();
        $newInvitation->invited_user_id = $invited_user->id;
        $newInvitation->event_id = $request->event_id;
        $newInvitation->author_id = Auth::user()->id;

        try
        {
            $newInvitation->save();

            Mail::send(new Email(
                "link",
                "zaproszenie",
                $invited_user->email,
                [
                    'userLogin' => $invited_user->login,
                    'function' => "event",
                    'hashedId' => $event->id,
                    'content' =>
                        "Użytkownik: ". $newInvitation->author->login
                        . " zaprasza Cię na wydarzenie: "
                        . $event->name . ' które odbywa się '
                        . $event->date . ' w '
                        . $event->adress_description
                        . "\n By zobaczyć szczegółowe informacje kliknij w ponizszy link:\n"
                ]));

            return response()->json(['status' => 'OK'], 200);
        }
        catch (QueryException $e)
        {
            return response()->json(["Error" => ["database exception", $e]], 400);
        }


    }

    public function respond(Request $request){
        try {
            $this->validate($request, [
                'event_id' => 'required|integer',
                'accepted' => 'required|boolean'
            ]);
        }catch (ValidationException $e){
            return response()->json(["Error" =>  $e->getResponse()], $e->status);
        }

        $invitation = Invitation::find( [Auth::user()->id,  $request->event_id]);

        if (Gate::denies('respond-invitation', $invitation)) {
            return response()->json(["Error" => "Unauthorised"], 403);
        }

        if(empty($invitation)){
            return response()->json(["Error" => "No content"], 400);

        }

        $invitation->accepted = $request['accepted'];

        try
        {
            $invitation->update();

            if($request['accepted']) {
                $event = Event::findOrFail($invitation->event_id);
                $user = User::findOrFail($invitation->invited_user_id);
                $event->decrement('slots_available');
                $user->participations()->attach($event->id);
                $user->update();
                $event->update();
            }

            return response()->json(['status' => 'OK'], 200);
        }
        catch (QueryException $e)
        {
            return response()->json(["Error" => ["database exception", $e]], 400);
        }
    }




}
