@extends("layouts.index")

{{--网站标题--}}
@section("title")
    XXX网站标题
@stop

@section("header")
    @include("widgets/header")
@stop

{{--内容块--}}
@section("content")

    {{-- 标题 --}}
    @include("widgets/index/index")

@stop


@section("css")
    {{HTML::style("/css/h")}}
@stop