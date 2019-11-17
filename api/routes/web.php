<?php

$router->get('/', function () use ($router) {
    return $router->app->version();
});



$router->group([
    'prefix' => '/user'
], function () use ($router) {

    $router->post('/', 'AuthController@register');
    $router->post('/login', 'AuthController@login');
    $router->get('/logged', [
        'uses' => 'AuthController@getLoggedUser'
    ]);

    $router->put('/updateEmail', 'AuthController@updateEmail');
    $router->put('/updatePassword', 'AuthController@updatePassword');
    $router->put('/confirmEmail', 'AuthController@confirmEmail');
    $router->put('/confirmNewEmail', 'AuthController@confirmNewEmail');
    $router->put('/sendRecoverPassword', 'AuthController@sendRecoverPassword');
    $router->put('/recoverPassword', 'AuthController@recoverPassword');


    $router->post('/update', 'UserController@update');
    $router->get('/{id:[\d]+}', [
        'as' => 'user.get',
        'uses' => 'UserController@get'
    ]);

    $router->get('/short/{id:[\d]+}', [
    'uses' => 'UserController@getShortened'
    ]);
    $router->get('/events', [
        'uses' => 'UserController@getCreatedEvents'
    ]);
    $router->get('/participations', [
        'uses' => 'UserController@getParticipations'
    ]);
    $router->get('/comments', [
        'uses' => 'UserController@getComments'
    ]);
    $router->get('/invitations', [
        'uses' => 'UserController@getInvitations'
    ]);

});

$router->group([
    'prefix' => '/admin'
], function () use ($router) {
    $router->get('/allUsers', 'AdminController@getAllUsers');
    $router->get('/fullUserInfo/{id:[\d]+}', [
        'uses' => 'AdminController@getFullUserInfo'
    ]);
    $router->get('/getAll', 'AdminController@getAllEvents');
    $router->get('/getUserPagination/{page:[\d]+}/{scope:[\d]+}',
        'AdminController@getUserPagination');
    $router->get('/getEventPagination/{page:[\d]+}/{scope:[\d]+}',
        'AdminController@getEventPagination');
    $router->get('/getCommentPagination/{page:[\d]+}/{scope:[\d]+}',
        'AdminController@getCommentPagination');

    $router->put('/blockUser/{id:[\d]+}', 'AdminController@blockUser');
    $router->put('/restoreUser/{id:[\d]+}', 'AdminController@restoreUser');
    $router->put('/blockEvent/{id:[\d]+}', 'AdminController@blockEvent');
    $router->put('/blockComment/{id:[\d]+}', 'AdminController@blockComment');
});

$router->group([
    'prefix' => '/event'
], function () use ($router) {
    $router->get('/', 'EventController@index');
    $router->post('/', 'EventController@add');
    $router->get('/{id:[\d]+}', [
        'uses' => 'EventController@getShortenedDetails'
    ]);
    $router->get('/allDetails/{id:[\d]+}', [
        'uses' => 'EventController@getAllDetails'
    ]);
    $router->put('/{id:[\d]+}', 'EventController@update');
    $router->delete('/{id:[\d]+}', 'EventController@delete');

    $router->get('/participants/{id:[\d]+}', [
        'uses' => 'EventController@getParticipants'
    ]);
    $router->get('/comments/{id:[\d]+}', [
        'uses' => 'EventController@getComments'
    ]);

    $router->get('/category/{id:[\d]+}', [
        'uses' => 'EventController@findByCategory'
    ]);
    $router->get('/date/{from}/{to}', [
        'uses' => 'EventController@findByDate'
    ]);
    $router->get('/all-slots/{from}/{to}', [
        'uses' => 'EventController@findByAllSlots'
    ]);
    $router->get('/available-slots/{from}/{to}', [
        'uses' => 'EventController@findByAvailableSlots'
    ]);
    $router->get('/name/{name}', [
        'uses' => 'EventController@findByName'
    ]);
    $router->post('/all', 'EventController@findByAllFilters');

});

$router->group([
    'prefix' => '/category'
], function () use ($router) {
    $router->get('/', 'CategoryController@index');
    $router->get('/{id:[\d]+}', [
        'as' => 'category.get',
        'uses' => 'CategoryController@get'
    ]);
});

$router->group([
    'prefix' => '/participation'],
    function () use ($router) {
        $router->post('/', 'ParticipationController@add');
        $router->delete('/{id:[\d]+}', 'ParticipationController@resign');
        $router->delete('/', 'ParticipationController@delete');

    });

$router->group([
    'prefix' => '/invitation'],
    function () use ($router) {
        $router->post('/', 'InvitationController@add');
        $router->get('/{id:[\d]+}', 'InvitationController@get');
        $router->put('/', 'InvitationController@respond');
    });


$router->group([
    'prefix' => '/comment'],
    function () use ($router) {
        $router->get('/{id:[\d]+}', [
            'as' => 'comment.get',
            'uses' => 'CommentController@get'
        ]);
        $router->post('/', 'CommentController@add');
        $router->put('/', 'CommentController@update');
        $router->delete('/{id:[\d]+}', 'CommentController@delete');
    });