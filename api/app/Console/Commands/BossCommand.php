<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class BossCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'boss';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Boss starting!';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $this->info('call migrate:fresh');
        $this->call('migrate:fresh');

        $this->info('call module:migrate');
        $this->call('module:migrate');

        $this->info('call module:seed');
        $this->call('module:seed');

        $this->call('passport:install', ['--force' => true]);

        $this->alert('Sosality complete, it took');
    }
}
