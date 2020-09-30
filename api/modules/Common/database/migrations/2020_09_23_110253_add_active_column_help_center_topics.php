<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddActiveColumnHelpCenterTopics extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('help_center_topics', function (Blueprint $table) {

            $table->tinyInteger('active')->default(1)->after('content');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('help_center_topics', function (Blueprint $table) {
            $table->dropColumn('active');
        });
    }
}
