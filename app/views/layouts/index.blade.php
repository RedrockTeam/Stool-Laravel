<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>@yield('title')</title>
    {{--Css--}}
    @yield('css')
</head>
<body>
    {{-- 网站顶部组件块 --}}
    @yield('header')

    {{-- 网站内容组件块 --}}
    @yield('content')

    {{-- 网站底部组件块 --}}
    @yield('footer')

    {{--Javascript--}}
    @yield('script')
</body>
</html>