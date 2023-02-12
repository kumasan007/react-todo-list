<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Auth\AuthenticationException;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     */
    protected function redirectTo($request)
    {
        if (! $request->expectsJson()) {
            return route('login');
        }
    }


    // 認証失敗したときのメッセージ設定（仮）
    // /**
    //  * Handle an unauthenticated user.
    //  *
    //  * @param \Illuminate\Http\Request $request request
    //  * @param array                    $guards  guard
    //  *
    //  * @return void
    //  *
    //  * @throws \Illuminate\Auth\AuthenticationException
    //  */
    // protected function unauthenticated($request, array $guards)
    // {
    //     throw new AuthenticationException(
    //         '認証に失敗しました。ログインをやり直してください。',
    //         $guards,
    //         $this->redirectTo($request)
    //     );
    // }
}
