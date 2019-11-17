<?php

namespace App\Http\Controllers;

use App\ChangeToken;
use App\Mail\Email;
use App\Resources\UserResource;
use Carbon\Carbon;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;
use Laravel\Lumen\Routing\Controller;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use App\User;

class AuthController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth', ['only' => [ 'updatePassword', 'updateEmail', 'getLoggedUser']]);
    }


    public function getLoggedUser()
    {
        $userId = Auth::user()->id;
        $user = User::find($userId);
        return response()->json(new UserResource($user), 200);
    }


    public function login(Request $request) {

        try {
            $this->validate($request, [
                'email' => 'string',
                'login' => 'string',
                'password' => ' required|string',
            ]);
        }catch (ValidationException $e){
            return response()->json(["Error" =>  $e->getResponse()], $e->status);
        }

        if(!empty($request->email)) {
            $user = User::where('email', $request->email)->first();

        } else if (!empty($request->login)){
            $user = User::where('login', $request->login)->first();
        }

        $password = $request->password;

        if(!empty($user))
        {

            if($user->blocked) {
                return response()->json(['Error' => 'Account blocked'], 403);
            }


            $decryptedPassword = Crypt::decrypt($user->password);
            if($password === $decryptedPassword) {
                $token = uniqid().strtotime(Carbon::now());
                User::where('id', $user->id)->update([
                    'remember_token'=> $token
                ]);

                if(!$user->email_confirmed) {
                    return response()->json(['Error' => 'Email not confirmed'], 403);
                }


                return response()->json(['status' => 'OK', 'token' => $token], 200);
            }
        }
        return response()->json(["Error" => "Bad credentials"], 401);
    }


    public function register(Request $request)
    {

        try {
            $this->validate($request, [
                'email' => 'required|email',
                'login' => 'required|string',
                'password' => 'required|string',
            ]);
        }catch (ValidationException $e){
            return response()->json(["Error" =>  $e->getResponse()], $e->status);
        }

        $user = new User();
        $user->login = $request->login;
        $user->email = $request->email;
        $user->avatar = "avatar.jpg";

        $encryptedPassword = Crypt::encrypt($request->password);
        $user->password = $encryptedPassword;

        $token = uniqid().strtotime(Carbon::now());
        $user->remember_token = $token;


        try
        {
            $user->save();

            $hashedId = Crypt::encrypt($user->id);

            Mail::send(new Email(
                 "link",
                 "potwierdź adres email",
                $user->email,
                [
                    'function' => "register",
                    'hashedId' => $hashedId,
                    'userLogin' => $user->login,
                    'content' =>
                        "By potwierdzić adres email, kliknij w ponizszy link"
                ]));

            return response()->json(['status' => 'OK'], 200);
        }
        catch (QueryException $e)
        {
            return response()->json(["Error" => ["Database exception" => $e]], 400);
        }
    }

    public function confirmEmail(Request $request)
    {
        try {
            $this->validate($request, [
                'hashedId' => 'required|string'
            ]);

        }catch (ValidationException $e){
            return response()->json(["Error" =>  $e->getResponse()], $e->status);
        }

        try {
            $hashedId = Crypt::decrypt($request->hashedId);

        }catch (DecryptException $e){
                return response()->json(['Error' => $e]);
            }


        $user = User::where('id', $hashedId)->first();
        $user->email_confirmed = true;

        try {
            $user->update();

            Mail::send(new Email(
                "statement",
                "rejestracja",
                $user->email,
                [
                    'userLogin' => $user->login,
                    'content' => "Rejestracja zakończona sukcesem!"
                ]));


            return response()->json(['status' => 'OK'], 200);
        }
        catch (QueryException $e)
        {
            return response()->json(["Error" => ["Database exception" => $e]], 400);
        }
    }


    public function updateEmail(Request $request)
    {

        try {
            $this->validate($request, [
                'email' => 'required|email',
                'password' => 'required|string',
            ]);
        }catch (ValidationException $e){
            return response()->json(["Error" =>  $e->getResponse()], $e->status);
        }

        $user = Auth::user();

        if (Crypt::decrypt($user->getAuthPassword()) !== $request->password){
            return response()->json(["Error" => "Wrong password"], 401);
        }


        if( User::where('email', $request->email)->first() != null ) {
            return response()->json(["Error" => "Email not available"], 400);
        }

        $mailChange = new ChangeToken();
        $mailChange -> user_id = $user->id;
        $mailChange -> prev_email = $user->email;
        $mailChange -> new_email = $request->email;


        try {
            $mailChange->save();

            $hashedId = Crypt::encrypt($mailChange->id);

            Mail::send(new Email(
                "link",
                "potwierdź zmianę adresu email",
                $request->email,
                [
                    'userLogin' => $user->login,
                    'function' => "mail_update",
                    'hashedId' => $hashedId,
                    'content' =>"By potwierdzić nowy adres email, kliknij w ponizszy link"
                ]));


            return response()->json(['status' => 'OK'], 200);
        }
        catch (QueryException $e)
        {
            return response()->json(["Error" => ["Database exception" => $e]], 400);
        }

    }

    public function confirmNewEmail(Request $request)
    {
        try {
            $this->validate($request, [
                'hashedId' => 'required|string'
            ]);

        }catch (ValidationException $e){
            return response()->json(["Error" =>  $e->getResponse()], $e->status);
        }

        $mailChangeId = Crypt::decrypt($request->hashedId);
        $mailChange = ChangeToken::where('id', $mailChangeId)->first();

        if (!$mailChange) {
            return response()->json(["Error" => "Request no longer available"]);
        }

        $prev_email = $mailChange->prev_email;
        $new_email = $mailChange->new_email;

        $user = User::where('email', $prev_email)->first();

        $user->email = $new_email;
        $user->setRememberToken(null);


        try {
            $user->update();
            $user->clearEmailTokens();


            Mail::send(new Email(
                "statement",
                "zmieniono adres email",
                $prev_email,
                [
                    'userLogin' => $user->login,
                    'content' =>
                        "Twój adres email został zmieniony na " . $new_email
                ]));


            return response()->json(['status' => 'OK'], 200);
        } catch (QueryException $e) {
            return response()->json(["Error" => ["Database exception" => $e]], 400);
        }
    }



        public function updatePassword(Request $request)
        {

        try {
            $this->validate($request, [
                'newPassword' => 'required|string',
                'password' => 'required|string',
            ]);
        }catch (ValidationException $e){
            return response()->json(["Error" =>  $e->getResponse()], $e->status);
        }

        $user = Auth::user();

        if (Crypt::decrypt($user->getAuthPassword()) !== $request->password){
            return response()->json(["Error" => "Wrong password"], 401);
        }

        $user->password = Crypt::encrypt($request->newPassword);
        $user->setRememberToken(null);

        try {
            $user->update();

            Mail::send(new Email(
                "statement",
                "zmiana hasła",
                $user->email,
                [
                    'userLogin' => $user->login,
                    'content' =>
                        "Twoje hasło zostało zmienione!"
                ]));



            return response()->json(['status' => 'OK'], 200);
        }
        catch (QueryException $e)
        {
            return response()->json(["Error" => ["Database exception" => $e]], 400);
        }
    }

    public function sendRecoverPassword(Request $request)
    {
        try {
            $this->validate($request, [
                'email' => 'required|email'
            ]);
        }catch (ValidationException $e){
            return response()->json(["Error" =>  $e->getResponse()], $e->status);
        }

        $user = User::where('email', $request->email)->first();

        $mailChange = new ChangeToken();
        $mailChange -> user_id = $user->id;
        $mailChange -> password_recover = true;

        try {
            $mailChange->save();
            $hashedId = Crypt::encrypt($mailChange->id);

            Mail::send(new Email(
                "link",
                "przypomnij hasło",
                $user->email,
                [
                    'userLogin' => $user->login,
                    'function' => "recover_password",
                    'hashedId' => $hashedId,
                    'content' =>
                        "By odzyskac dostęp do konta, kliknij w poniższy link!"
                ]));



            return response()->json(['status' => 'OK'], 200);
        }
        catch (QueryException $e)
        {
            return response()->json(["Error" => ["Database exception" => $e]], 400);
        }
    }

    public function recoverPassword(Request $request)
    {
        try {
            $this->validate($request, [
                'newPassword' => 'required|string',
                'hashedId' => 'required|string'
            ]);

        }catch (ValidationException $e){
            return response()->json(["Error" =>  $e->getResponse()], $e->status);
        }

        $hashedId = Crypt::decrypt($request->hashedId);
        $changeToken = ChangeToken::where('id', $hashedId)->first();

        $user = User::where('id', $changeToken->user_id)->first();
        $user->password = Crypt::encrypt($request->newPassword);
        $user->remember_token = null;

        try {
            $user->update();
            $user->clearPasswordTokens();

            Mail::send(new Email(
                "statement",
                "zmiana hasła",
                $user->email,
                [
                    'userLogin' => $user->login,
                    'content' =>
                        "Twoje hasło zostało zmienione!"
                ]));

            return response()->json(['status' => 'OK'], 200);
        }
        catch (QueryException $e)
        {
            return response()->json(["Error" => ["Database exception" => $e]], 400);
        }
    }

    }
