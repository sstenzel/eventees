<?php

namespace App\Http\Controllers;

use App\Event;
use App\Resources\InvitationResource;
use App\Resources\UserResource;
use App\Resources\UserShortResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\ValidationException;
use Laravel\Lumen\Routing\Controller;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use App\User;

class UserController extends Controller
{

    public function __construct()
    {
//        $this->middleware('auth');
    }


    public function update(Request $request)
    {

        $user = Auth::user();

        if (Gate::denies('modify-user', $user)) {
            return response()->json(["Error" => "Unauthorised"], 403);
        }

        try {
            $this->validate($request, [
                'first_name' => 'string',
                'last_name' => ' string',
                'description' => ' string',
                'sex' => ' string',
                'city' => ' string',
                'avatar' => 'file|max:8192|mimes:jpeg,bmp,png,jpg',
                'birth' => ' date',

            ]);
        }catch (ValidationException $e){
            return response()->json(["Error" =>  $e->getResponse()], $e->status);
        }


            if($request->first_name)
            $user->first_name = $request->first_name;
            if($request->last_name)
                $user->last_name = $request->last_name;
            if($request->sex)
                $user->sex = $request->sex;
            if($request->birth)
                $user->birth = $request->birth;
            if($request->city)
                $user->city = $request->city;


        if ($request->hasFile('avatar') && $request->avatar->isValid()) {
            $avatarName = $request->avatar->hashName();
//            while (User::avatarInDatabase($avatarName)) {
//                $avatarName = '1' . $avatarName;
//            }

            $request->avatar->move(base_path() . '/public/uploads/images/',
                $avatarName);

//            $prevAvatarName = $user->avatar;
//            if ($prevAvatarName !== "avatar.png") {
//                $prevAvatarPath = base_path() . '/public/uploads/images' . $prevAvatarName;
//                if (file_exists($prevAvatarPath)) {
////                    unlink($prevAvatarPath);
//                }
//            }
            if (file_exists(base_path() . '/public/uploads/images/' . $avatarName)) {
                $user->avatar = $avatarName;
            }
        }

            try {
                $user->update();

                return response()->json(['status' => 'OK'], 200);
            } catch (QueryException $e) {
                return response()->json(["Error" => ["Database exception" => $e]], 400);
            }
        }

    public function get($id)
    {

        $user = User::findOrFail($id);

        if (Gate::denies('modify-user', $user)) {
            return response()->json(["Error" => "Unauthorised"], 403);
        }

        return response()->json(new UserResource($user), 200);
    }


    public function getShortened($id)
    {

        $user = User::findOrFail($id);
        return response()->json(new UserShortResource($user), 200);
    }

    public function getCreatedEvents()
    {
        $userId = Auth::user()->id;
        $user = User::findOrFail($userId);

        $events = $user->currentCreatedEvents;
        $response = Event::toShortenedResourceArray($events);

        return response()->json($response, 200);
    }

    public function getParticipations()
    {
        $userId = Auth::user()->id;
        $user = User::findOrFail($userId);
        $events = $user->currentParticipations;

        $response = Event::toShortenedResourceArray($events);

        return response()->json($response, 200);
    }

    public function getComments(){
        $userId = Auth::user()->id;
        $user = User::findOrFail($userId);
        $comments = $user->comments->map(function ($value) {
            return ['event_id' => $value->event_id,
            'created_at' => $value->created_at,
            'content' => $value->content];
        });
        return response()->json($comments, 200);

    }


    public function getInvitations(){
        $userId = Auth::user()->id;
        $user = User::findOrFail($userId);
        $invitations = $user->currentInvitations;

        $response = $invitations->map(function ($value) {
            return new InvitationResource($value);
        });

        return response()->json($response, 200);

    }
}
