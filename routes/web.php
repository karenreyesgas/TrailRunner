<?php
/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;

$router->get('/', function () {
    return view('accueil');
});
$router->get('/accueil', function () {
    return view('accueil');
});
$router->get('/connexion', function () {
    session_start();
    if(isset($_SESSION['connecte']) && $_SESSION['connecte'] == 1){
        return redirect('infos');
    }else{
        return view('connexion');
    }
});
$router->post('/connexion', function () {
	$query = DB::table('personne')
		->select(DB::raw('count(*) as result'))
		->where([['pseudo', $_POST['pseudo']],['mdp', $_POST['mdp']]])
		->get();
	if($query[0]->result == 1){
        session_start();
        $query = DB::table('personne')
		->select('idpersonne', 'pseudo')
		->where([['pseudo', $_POST['pseudo']],['mdp', $_POST['mdp']]])
        ->get();
        $_SESSION['connecte'] = 1;
        $_SESSION['pseudo'] = $query[0]->pseudo;
        $_SESSION['id'] = $query[0]->idpersonne;
		return redirect('infos');
	}else{
		return view('connexion');
	}
});
$router->group(['prefix' => '/infos'], function () use ($router) {
    $router->get('/', function () {
        session_start();
        if(isset($_SESSION['connecte']) && $_SESSION['connecte'] == 1){
            return view('infos');
        }else{
            return redirect('connexion');
        }
    });
    $router->post('/', function(){
        session_start();
        $query = DB::table('course')
        ->join('personne', 'course.idpersonne', '=', 'personne.idpersonne')
        ->select('course.idcourse', 'course.datecourse', 'course.debutcourse', 'course.fincourse')
        ->where('personne.idpersonne',  $_SESSION['id'])
        ->orderBy('course.datecourse', 'desc')
        ->get();
        return response()->json($query);
    });
    $router->post('/infosCourse', function (Request $request) {
        $data = $request->json()->all();
        $query = DB::table('infocourse')
        ->select('cardio', 'vitesse', 'dateinfo', 'idcourse')
        ->where('idcourse',  $data[0])
        ->get();
        return response()->json($query);
    });
});
$router->get('/deco', function(){
    session_start();
    session_destroy();
    return redirect('accueil');
});


$router->post('/postDebut', function(){
    session_start();
    $_SESSION['idCourse'] = $query = DB::table('course')
        ->insertGetId(['idpersonne' => $_SESSION['id'], 'datecourse' => date("Y-m-d"), 'debutcourse' => date("Y-m-d H:i:s")], 'idcourse');
});
$router->post('/postFin', function(){
    session_start();
    $query = DB::table('course')
        ->where('idcourse', $_SESSION['idCourse'])
        ->update(['fincourse' => date("Y-m-d H:i:s")]);
});
$router->post('/postDetails', function(Request $request){
    session_start();
    $data = $request->json()->all();
    $query = DB::table('infocourse')
        ->insert(['idcourse' => $_SESSION['idCourse'], 'cardio' => $data[1], 'vitesse' => $data[2], 'dateinfo' => date("Y-m-d H:i:s")]);
});

$router->post('/connect', function () {
	$query = DB::table('personne')
		->select(DB::raw('count(*) as result'))
		->where([['pseudo', $_POST['pseudo']],['mdp', $_POST['mdp']]])
		->get();
	if($query[0]->result == 1){
        session_start();
        $query = DB::table('personne')
		->select('idpersonne', 'pseudo')
		->where([['pseudo', $_POST['pseudo']],['mdp', $_POST['mdp']]])
        ->get();
        $_SESSION['connecte'] = 1;
        $_SESSION['pseudo'] = $query[0]->pseudo;
        $_SESSION['id'] = $query[0]->idpersonne;
		return redirect('infos');
	}else{
		return view('connexion');
	}
});