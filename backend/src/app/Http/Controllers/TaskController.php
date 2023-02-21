<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\User;
use App\Http\Requests\CreateTask;
use App\Http\Requests\EditTask;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $tasks = Task::where('user_id', Auth::id())->get();

        return response()->json($tasks, 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param \Illuminate\Http\CreateTask $request フォームのリクエストの内容.
     *
     * @return \Illuminate\Http\Response
     */
    public function store(CreateTask $request)
    {
        $request->merge(['user_id' => Auth::id()]);

        $task = new Task();
        $createdTask = $task->create($request->restriction());

        return response()->json(['message' => 'The post was successful.', 'task' => $createdTask], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param integer $id タスクのid.
     *
     * @return \Illuminate\Http\Response
     */
    public function show(int $id)
    {
        $task = Task::find($id);
        if (!$task) {
            return response()->json(['message' => 'Task not found.'], 404);
        }
        if (Auth::id() != $task->user_id) {
            return response()->json(['message' => 'No access authorisation.'], 403);
        }

        return response()->json($task, 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \Illuminate\Http\EditTask $request フォームのリクエストの内容.
     * @param integer                   $id      タスクのid.
     *
     * @return \Illuminate\Http\Response
     */
    public function update(EditTask $request, int $id)
    {
        $task = Task::find($id);
        if (!$task) {
            return response()->json(['message' => 'Task not found.'], 404);
        }
        if (Auth::id() != $task->user_id) {
            return response()->json(['message' => 'No access authorisation.'], 403);
        }

        $task->update($request->restriction());
        $updatedTask = Task::find($id);

        return response()->json(['message' => 'The update was successful.', 'task' => $updatedTask], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param integer $id タスクのid.
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy(int $id)
    {
        $task = Task::find($id);
        if (!$task) {
            return response()->json(['message' => 'Task not found.'], 404);
        }
        if (Auth::id() != $task->user_id) {
            return response()->json(['message' => 'No access authorisation.'], 403);
        }
        Task::destroy($id);

        return response()->json(['message' => 'The delete was successful.'], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function returnNotFound()
    {
        return response()->json(['message' => 'This URL does not exist.'], 404);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function returnNotAllowed()
    {
        return response()->json(['message' => 'This HTTP method is not allowed.'], 405);
    }
}