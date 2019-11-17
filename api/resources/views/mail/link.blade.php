@extends('mail.layout')


@section('content')

    <p>
        <h2>
        @php
            echo 'Witaj ' . $userLogin . '!'
        @endphp
        </h2>
        <h3>
            @php
                echo $content
            @endphp
        </h3>
        <h3>
            @php
                echo 'http://localhost:3000/?' . $function . '=true&' . $hashedId
            @endphp
        </h3>

    </p>

@endsection