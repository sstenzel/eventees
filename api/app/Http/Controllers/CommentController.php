<?php

namespace App\Http\Controllers;

use App\Comment;
use App\Event;
use App\Mail\Email;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;
use Laravel\Lumen\Routing\Controller;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;

class CommentController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth');
    }


    public function add(Request $request)
    {

        try {
            $this->validate($request, [
                'event_id' => 'required|integer',
                'content' => 'required|string'
            ]);
        }catch (ValidationException $e){
            return response()->json(["Error" =>  $e->getResponse()], $e->status);
        }

        $event = Event::findOrFail($request->event_id);

        if (Gate::denies('add-comment', $event)) {
            return response()->json(["Error" => "Unauthorised"], 403);
        }

        $comment = new Comment();
        $comment->user_id = Auth::user()->id;
        $comment->event_id = $request->event_id;
        $comment->content = $request['content'];

        try
        {
            $comment->save();

            foreach ($event->participants as $participant) {

                Mail::send(new Email(
                    "link",
                    "nowy komentarz",
                    $participant->email,
                    [
                        'userLogin' => $participant->login,
                        'function' => "event",
                        'hashedId' => $event->id,
                        'content' =>
                            "Użytkownik " . $comment->author->login
                            . " dodał komentarz do wydarzenia w którym uczestniczysz:"
                            . $event->name . ' które odbywa się '
                            . $event->date . ' w '
                            . $event->adress_description
                            . "\no treści: \n"
                            . $comment->content
                            . "\n By zobaczyć szczegółowe informacje kliknij w ponizszy link:\n"
                    ]));
            }

            return response()->json(['status' => 'OK'], 200);
        }
        catch (QueryException $e)
        {
            return response()->json(["Error" => ["database exception", $e]], 400);
        }


    }

    public function update(Request $request){

        try {
            $this->validate($request, [
                'comment_id' => 'required|integer',
                'content' => 'required|string'
            ]);
        }catch (ValidationException $e){
            return response()->json(["Error" =>  $e->getResponse()], $e->status);
        }

        $comment  = Comment::findOrFail($request->comment_id);

        if (Gate::denies('update-comment', $comment)) {
            return response()->json(["Error" => "Unauthorised"], 403);
        }

        if(empty($comment)){
            return response()->json(["Error" => "No content"], 400);
        }

        $comment->content = $request['content'];
        $event = $comment->event;

        try
        {
            $comment->update();


            foreach ($event->participants as $participant) {
                Mail::send(new Email(
                    "link",
                    "nowy komentarz",
                    $participant->email,
                    [
                        'userLogin' => $participant->login,
                        'function' => "event",
                        'hashedId' => $event->id,
                        'content' =>
                            "Użytkownik " . $comment->author->login
                            . " dodał komentarz do wydarzenia w którym uczestniczysz:"
                            . $event->name . ' które odbywa się '
                            . $event->date . ' w '
                            . $event->adress_description
                            . "\no treści: \n"
                            . $comment->content
                            . "\n By zobaczyć szczegółowe informacje kliknij w ponizszy link:\n"
                    ]));
            }

            return response()->json(['status' => 'OK'], 200);
        }
        catch (QueryException $e)
        {
            return response()->json(["Error" => ["database exception", $e]], 400);
        }
    }


    public function delete($id)
    {
        $comment = Comment::findOrFail($id);
        if(empty($comment)){
            return response()->json(["Error" => "No content"], 204);

        }

        if (Gate::denies('delete-comment', $comment)) {
            return response()->json(["Error" => "Unauthorised"], 403);
        }

        try
        {
            $comment->delete();
            return response()->json(['status' => 'OK'], 200);
        }
        catch (QueryException $e)
        {
            return response()->json(["Error" => ["database exception", $e]], 400);
        }

    }


}
