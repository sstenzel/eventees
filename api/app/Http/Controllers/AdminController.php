<?php

namespace App\Http\Controllers;

use App\Blocked;
use App\Comment;
use App\Event;
use App\Mail\Email;
use App\Resources\CommentEssentialsResource;
use App\Resources\EventEssentialsResource;
use App\Resources\UserEssentialsResource;
use App\Resources\UserFullResource;
use App\User;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;


class AdminController extends Controller
{
    public function __construct()
    {
        $this->middleware('admin');
    }

    public function getAllUsers()
    {
        return response()->json(User::all(),200);
    }

    public function getAllEvents()
    {
        $events = Event::all();
        $response = Event::toShortenedResourceArray($events);

        return response()->json($response, 200);
    }

    public function getUserPagination($page, $scope)
    {
        $idFrom = ($page - 1) * $scope;

        $users = User::where('id', '>' ,$idFrom)->where('id', '>', 1)->limit($scope)->get();

        if($users->isEmpty()) {
            return response()->json(['users' => [],  'meta' => ['lastPage' => true]],200);
        }

        $lastPage= User::all()->last()->id <= $users->last()->id;

        $response = $users
            ->map(function ($value) {
                return new UserEssentialsResource($value);
            });
        return response()->json(['users' => $response, 'meta' => ['lastPage' => $lastPage]],200);
    }

    public function getEventPagination($page, $scope)
    {
        $idFrom = ($page - 1) * $scope;

        $events = Event::where('id', '>' ,$idFrom)->limit($scope)->get();

        if($events->isEmpty()) {
            return response()->json(['events' => [],  'meta' => ['lastPage' => true]],200);
        }

        $lastPage= Event::all()->last()->id <= $events->last()->id;

        $response = $events
            ->map(function ($value) {
                return new EventEssentialsResource($value);
            });
        return response()->json(['events' => $response, 'meta' => ['lastPage' => $lastPage]],200);
    }

    public function getCommentPagination($page, $scope)
    {
        $idFrom = ($page - 1) * $scope;

        $comments = Comment::where('id', '>' ,$idFrom)->limit($scope)->get();

        if($comments->isEmpty()) {
            return response()->json(['comments' => [],  'meta' => ['lastPage' => true]],200);
        }

        $lastPage= Comment::all()->last()->id <= $comments->last()->id;

        $response = $comments
            ->map(function ($value) {
                return new CommentEssentialsResource($value);
            });
        return response()->json(['comments' => $response, 'meta' => ['lastPage' => $lastPage]],200);
    }


    public function getFullUserInfo($id)
    {
        $user = User::findOrFail($id);
        return response()->json(new UserFullResource($user), 200);
    }

    public function blockUser($id, Request $request)
    {
        try {
            $this->validate($request, [
                'reason' => 'required|string'
            ]);
        }catch (ValidationException $e){
            return response()->json(["Error" =>  $e->getResponse()], $e->status);
        }

        $user = User::find($id);
        $user->blocked = true;
        $user->remember_token = null;
        $block = new Blocked();
        $block->reason = $request->reason;
        $block->user_id = $user->id;

        try {

            $user->update();
            $block->save();

            Mail::send(new Email(
                "statement",
                "blokada konta",
                $user->email,
                [
                    'userLogin' => $user->login,
                    'content' =>
                        "Twoje konto zostało zablokowane! \n Przyczyna: \n"
                        . $request->reason
                        . "\nBy odzyskać dostęp do konta skontaktuj się z administratorem strony"
                ]));


            return response()->json(['status' => 'OK'], 200);
        } catch (QueryException $e) {
            return response()->json(["Error" => ["Database exception" => $e], 400]);
        }
    }

    public function restoreUser($id, Request $request)
    {

        $user = User::find($id);
        $user->blocked = false;

        try {
            $user->update();

            Mail::send(new Email(
                "statement",
                "odblokowanie konta",
                $user->email,
                [
                    'userLogin' => $user->login,
                    'content' =>
                        "Twoje konto zostało odblokowane!"
                ]));



            return response()->json(['status' => 'OK'], 200);
        } catch (QueryException $e) {
            return response()->json(["Error" => ["Database exception" => $e]], 400);
        }
    }

    public function blockEvent($id, Request $request)
    {
        try {
            $this->validate($request, [
                'reason' => 'required|string'
            ]);
        }catch (ValidationException $e){
            return response()->json(["Error" =>  $e->getResponse()], $e->status);
        }

        $event = Event::find($id);
        $event->blocked = true;
        $block = new Blocked();
        $block->reason = $request->reason;
        $block->event_id = $event->id;

        try {

            $event->update();
            $block->save();


            Mail::send(new Email(
                "statement",
                "blokada wydarzenia",
                $event->author->email,
                [
                    'userLogin' => $event->author->login,
                    'content' =>
                        "Z przykrością informujemy, że Twoje wydarzenie: "
                        . $event->name . ' które miało odbyć się '
                        . $event->date . ' w ' . $event->adress_description
                        . " zostało zablokowane przez administratora z powodu:\n"
                        .$request->reason
                ]));


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

            $event->participants()->detach();
            $event->invitations()->delete();


            return response()->json(['status' => 'OK'], 200);
        } catch (QueryException $e) {
            return response()->json(["Error" => ["Database exception" => $e]], 400);
        }
    }

    public function blockComment($id, Request $request)
    {
        try {
            $this->validate($request, [
                'reason' => 'required|string'
            ]);
        }catch (ValidationException $e){
            return response()->json(["Error" =>  $e->getResponse()], $e->status);
        }

        $comment = Comment::find($id);
        $comment->blocked = true;

        $block = new Blocked();
        $block->reason = $request->reason;
        $block->comment_id = $comment->id;

        $content = $comment->content;
        $event = $comment->event;
        $author = $comment->author;

        $comment->content = "Komentarz został zablokowany!";

        try {

            $comment->update();
            $block->save();

            Mail::send(new Email(
                "statement",
                "blokada komentarza",
                $author->email,
                [
                    'userLogin' => $author->login,
                    'content' =>
                        "Z przykrością informujemy, że Twoj komentarz o treści: \n"
                        . $content . " \ndo wydarzenia: "
                        . $event->name . ' które odbywa się '
                        . $event->date . ' w ' . $event->adress_description
                        . " zostało zablokowane przez administratora z powodu:\n"
                        . $request->reason
                ]));



            return response()->json(['status' => 'OK'], 200);
        } catch (QueryException $e) {
            return response()->json(["Error" => ["Database exception" => $e]], 400);
        }
    }



}
