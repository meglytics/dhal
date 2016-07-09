/*
 ** Copyright [2013] [Megam Systems]
 **
 ** Licensed under the Apache License, Version 2.0 (the "License");
 ** you may not use this file except in compliance with the License.
 ** You may obtain a copy of the License at
 **
 ** http://www.apache.org/licenses/LICENSE-2.0
 **
 ** Unless required by applicable law or agreed to in writing, software
 ** distributed under the License is distributed on an "AS IS" BASIS,
 ** WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 ** See the License for the specific language governing permissions and
 ** limitations under the License.
 */

var PORTAL = function() {

	$(function() {		
		
		$("#login-submit").click(function() {

			var isValid = true;
			$('#semail,#spassword').each(function() {
				if ($.trim($(this).val()) == '') {
					isValid = false;
					$(this).css({
						"border" : "1px solid red",
						"background" : "#FFCECE"
					});
				} else {
					$(this).css({
						"border" : "",
						"background" : ""
					});
				}
			});
			if (isValid == false)
				e.preventDefault();
				
			var json = {};
			json["email"] = $("#semail").val();
			json["password"] = $("#spassword").val();
            NProgress.start();
			$.ajax({
				url : "/signin",
				type : "POST",
				data : JSON.stringify(json),
				contentType : "application/json",
			}).done(function(data, textStatus, xhr) {
				NProgress.done();				
                window.location.replace("/mconnect");
			}).fail(function(xhr, textStatus, err) {
				NProgress.done();
				PORTAL.notify("<strong>Error</strong>: " + xhr.responseText, "danger");
			});
				
		});	
		
		$("#register-submit").click(function() {

			var isValid = true;
			$('#username,#email,#password').each(function() {
				if ($.trim($(this).val()) == '') {
					isValid = false;
					$(this).css({
						"border" : "1px solid red",
						"background" : "#FFCECE"
					});
				} else {
					$(this).css({
						"border" : "",
						"background" : ""
					});
				}
			});
			if (isValid == false)
				e.preventDefault();
				
			var json = {};
			json["email"] = $("#email").val();
			json["password"] = $("#password").val();
			json["phone"] = $("#phone").val();
			json["username"] = $("#username").val();
            NProgress.start();
			$.ajax({
				url : "/signup",
				type : "POST",
				data : JSON.stringify(json),
				contentType : "application/json",
			}).done(function(data, textStatus, xhr) {
				NProgress.done();				
                window.location.replace("/mconnect");
			}).fail(function(xhr, textStatus, err) {
				NProgress.done();
				PORTAL.notify("<strong>Error</strong>: " + xhr.responseText, "danger");
			});
				
		});	
		
	});

	return {
	};
}();
