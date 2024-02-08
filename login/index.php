<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<title>Вход с паролем | Frontpad</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf8">
<meta name="viewport" content="user-scalable=no, width=device-width, initial-scale=1.0, maximum-scale=1.0">
<head>
<link rel="shortcut icon" type="image/x-icon" href="/favicon.ico">
<script type="text/javascript" src="js/lib.js"></script>
<script src='https://www.google.com/recaptcha/api.js?render=6LdXzuwaAAAAADvuRZbbYWZUIaov1iH0kagHQfCT'></script><script>
function codegen(id) {
	$("#"+id).attr("src","blocks/code/codegen.php?rand="+Math.random())
}

	function lg_action() {
		grecaptcha.ready(function() {
			grecaptcha.execute('6LdXzuwaAAAAADvuRZbbYWZUIaov1iH0kagHQfCT', {action: 'submit'}).then(function(token) {
				$('#status').html('');
				$('#tokenV3').val(token);
			 document.getElementById('enterForm').submit();
			});
		});
	}document.onkeyup = function (e) {
	e = e || window.event;
	if (e.keyCode === 13) {lg_action();}
	return false;
}
</script>
<style>
body {width:100%; height:100%; margin:0px; font-family:Arial, Helvetica, sans-serif; font-size:14px; color:#555; background:#737f88;}
h1 {margin:0; font-size:22px; color:#333; font-weight:100; text-transform:uppercase;}

.parent {width:100%; height:100%; position:fixed; top:0; left:0; display:flex; align-items:center; align-content:center; justify-content:center; overflow:auto;}

.enter_form {padding:30px 40px 40px 40px; width: 310px; min-height:170px; background:#f3f4f5; border-radius:5px; -moz-border-radius:5px; -webkit-border-radius:5px; -webkit-box-shadow: 0 4px 15px rgba(0,0,0,0.25); -moz-box-shadow: 0 4px 15px rgba(0,0,0,0.25); box-shadow: 0 4px 15px rgba(0,0,0,0.25);}

.enter_back {position:absolute; top:50%; left:50%; width:310px; height:20px; margin:-165px 0 0 -210px; padding:0 40px;}
.enter_back a {color:#fff;}
.enter_form a {font-size:13px; color:#676e75;}
.enter_error {position:absolute; top:50%; left:50%; width:310px; min-height:20px; margin:-240px 0 0 -210px; padding:0 40px; color:#fff; font-size:13px;}

.input {width:80%; margin:0; padding:6px 8px; font-size:14px; color:#444; border:1px solid #ccc; border-radius:3px; -moz-border-radius:3px; -webkit-border-radius:3px; box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.1); -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.1);}
.input.code {width:40%;}
.input:focus {border-color:#1e8dd8; outline:0; box-shadow: 0 0 5px rgba(30, 141, 216, 0.3);}
.img {width:100px; height:30px; margin:0 6px 0 0; cursor:pointer; float:right;}
.btn {margin:0; padding:6px 12px; color:#fff; font-weight:300; text-decoration:none; cursor:pointer; background:#429edb; border:none; border-radius:3px; -moz-border-radius:3px; -webkit-border-radius:3px;}
</style>
</head>
<body>
<div class='parent'>
<div class='enter_back'><a href='https://frontpad.ru'>Вернуться на сайт</a></div><div class='enter_form'>
	<form id='enterForm' action='index.php' method='post'>
	<table width='100%' height='100%' border='0' cellpadding='5' cellspacing='0'>
	<tr valign='top'><td colspan='3'><h1>Frontpad</h1></td></tr>
	<tr><td align='left' width='60'>Email</td><td align='left' colspan='2'><input id='login' name='login' type='text' class='input' style='width:95%;' maxlength='50' /></td></tr>
	<tr><td align='left' width='60'>Пароль</td><td align='left' colspan='2'><input name='password' type='password' class='input' style='width:95%;' maxlength='50' ></td></tr><input name='tokenV3' id='tokenV3' type='hidden' /> <tr valign='middle'><td align='left' colspan='3'><input type='checkbox' value='1' name='mobile' id='mobile' /> <label for='mobile' style='font-size:13px;'>войти в мобильную версию</label></td></tr><tr valign='middle'><td align='left' colspan='2'><a href='/login/passrem.php'>восстановить пароль</a></td><td width='100' align='right' id='status'><span onclick='lg_action();' class='btn'>Войти</span></td></tr></table></form></div></div>
</body>
</html>
<!-- Yandex.Metrika counter -->
<script type="text/javascript">
(function (d, w, c) {
    (w[c] = w[c] || []).push(function() {
        try {
            w.yaCounter16873678 = new Ya.Metrika({id:16873678,
					trackLinks:true,
                    accurateTrackBounce:true,
                    ut:"noindex"});
        } catch(e) { }
    });

    var n = d.getElementsByTagName("script")[0],
        s = d.createElement("script"),
        f = function () { n.parentNode.insertBefore(s, n); };
    s.type = "text/javascript";
    s.async = true;
    s.src = (d.location.protocol == "https:" ? "https:" : "http:") + "//mc.yandex.ru/metrika/watch.js";

    if (w.opera == "[object Opera]") {
        d.addEventListener("DOMContentLoaded", f, false);
    } else { f(); }
})(document, window, "yandex_metrika_callbacks");
</script>
<!-- /Yandex.Metrika counter -->
