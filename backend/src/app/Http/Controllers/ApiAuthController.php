<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Exception;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use \Symfony\Component\HttpFoundation\Response;

class ApiAuthController extends Controller
{
    /**
     * App\Http\Middleware\JpJsonResponseを読み込む
     */
    public function __construct()
    {
        $this->middleware('JpJsonResponse');
    }

    /**
     * ユーザの新規登録
     *
     * @param Request $request 登録するユーザ情報
     *
     * @return json ユーザ登録の成否
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->messages(), 400);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return response()->json(['ユーザー登録が完了しました', $user], 200);
    }

    /**
     * ログイン
     *
     * SPA方式
     *
     * @param  Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();

            return response()->json(['ログインしました', Auth::user()], 200);
        }

        return response()->json('ログインに失敗しました', 401);
    }

    /**
     * ログアウト
     *
     * SPA方式
     *
     * @param  Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json('ログアウトしました', 200);
    }
}
