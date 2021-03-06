<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddHyphenColumnToHelpCenterTopicsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('help_center_topics', function (Blueprint $table) {
            $table->tinyInteger('hyphen')->default(0)->after('sort_order');
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
            $table->dropColumn('hyphen');
        });
    }
}
