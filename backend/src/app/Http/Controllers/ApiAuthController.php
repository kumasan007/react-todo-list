<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Http\Requests\ApiRegisterUser;

class ApiAuthController extends Controller
{
        /**
         * Display a listing of the resource.
         *
         * @param App\Http\Requests\ApiRegisterUser $request 登録内容.
         *
         * @return \Illuminate\Http\Response
         */
    public function register(ApiRegisterUser $request)
    {
        $user = new User();

        $request->merge(["password" => Hash::make($request->password)]);

        $user->create($request->dbColumnsRestriction());

        $registeredUser = User::orderBy('created_at', 'DESC')->first();

        return response()->json(['message' => 'Registered correctly', 'user_info' => $registeredUser], 200);
    }

    /**
     * Display a listing of the resource.
     *
     * @param \Illuminate\Http\Request　 $request ログインに必要な情報.
     *
     * @return \Illuminate\Http\Response
     */
    public function login(Request $request)
    {
        if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            $user = User::where('email', $request->email)->firstOrFail();
            $request->session()->regenerate();
            $token = $user->createToken($user->id)->plainTextToken;
            return response()->json(['message' => 'You are logged in.', 'token' => $token], 200);
        } else {
            return response()->json(['message' => 'Authentication failed.'], 403);
        }
    }

    /**
     * Display a listing of the resource.
     *
     * @param \Illuminate\Http\Request　 $request ログインしているユーザーの情報.
     *
     * @return \Illuminate\Http\Response
     */
    public function logout(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Logout failed'], 401);
        }
        if (method_exists(auth()->user()->currentAccessToken(), 'delete')) {
            auth()->user()->currentAccessToken()->delete();
        } else {
            session()->invalidate();
        }

        return response()->json(['message' => 'You are logged out.'], 200);
    }
}