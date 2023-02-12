<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\TaskRequest;
use App\Models\Task;
use App\Models\User;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    /**
     * App\Http\Middleware\JpJsonResponseを読み込む
     */
    public function __construct()
    {
        $this->middleware('JpJsonResponse');
    }

    /**
     * タスク一覧を表示する
     *
     * @return json JSON形式で返す
     */
    public function index()
    {
        $loginUserId = Auth::id();
        $loginUserTasks = Task::where('user_id', $loginUserId)->get();

        if (!$loginUserTasks) {
            return response()->json('タスクはありません。', 404);
        }

        return response()->json($loginUserTasks, 200);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        // 使用しない
    }

    /**
     * タスクを作成・保存する
     *
     * @param  use App\Http\Requests\TaskRequest $request
     * @return json JSON形式で返す
     */
    public function store(TaskRequest $request)
    {
        $newTask = new Task();
        $newTask = Auth::user()->tasks()->create([
            'title' => $request->input('title'),
            'deadline' => $request->input('deadline'),
            'status' => $request->input('status'),
            'user_id' => Auth::id()
        ]);

        return response()->json(['タスクを作成しました', $newTask], 200);
    }

    /**
     * 特定のタスク一つを表示する
     *
     * @param  integer $id
     * @return json JSON形式で返す
     */
    public function show($id)
    {
        // 使用しない
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        // 使用しない
    }

    /**
     * タスクを編集・更新する
     *
     * @param  use Illuminate\Http\Request $request
     * @param  int  $id
     * @return json JSON形式で返す
     */
    public function update(Request $request, $id)
    {
        $task = Task::find($id);

        if (!$task) {
            return response()->json('該当タスクがありません', 404);
        }

        if (!Gate::allows('update-task', $task)) {
            return response()->json('編集権限がありません。', 403);
        }

        $task->title = $request->input('title');
        $task->deadline = $request->input('deadline');
        $task->status = $request->input('status');

        $task->update();

        return response()->json(['更新しました', $task], 200);
    }

    /**
     * タスクを削除する
     *
     * @param  int  $id
     * @return json JSON形式で返す
     */
    public function destroy($id)
    {
        $task = Task::find($id);

        if (!$task) {
            return response()->json('該当タスクがありません', 404);
        }

        if (! Gate::allows('update-task', $task)) {
            return response()->json('権限がありません', 403);
        }

        $task->delete();

        return response()->json(['タスクを削除しました', $task], 200);
    }
}
