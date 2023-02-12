<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Task>
 */
class TaskFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            // 'title' => $this->faker->name(),
            'title' => $this->faker->realText(20),
            // 'body' => $this->faker->realText(120),
            'deadline' => $this->faker->dateTimeBetween($startDate = 'now', $endDate = '+2 week'),
            'created_at' => now(),
            'updated_at' => now(),
            'status' => $this->faker->randomElement($array=[1,2,3])
        ];
    }
}
