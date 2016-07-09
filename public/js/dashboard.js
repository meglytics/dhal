$(function() {

	var $contextMenu = $("#contextMenu");
	//$("body").on("contextmenu", ".list-group a", function(e) {
	$("#btnAddPage").click(function(e) {
		$contextMenu.css({
			display : "block",
			left : e.pageX,
			top : e.pageY
		});
		return false;
	});
	$("body").click(function(e) {
		$contextMenu.hide();
	});
	
	var $contextMenu1 = $("#contextMenu1");
	//$("body").on("contextmenu", ".list-group a", function(e) {
	$("#btnAddPage1").click(function(e) {
		$contextMenu1.css({
			display : "block",
			left : e.pageX,
			top : e.pageY
		});
		return false;
	});
	$("body").click(function(e) {
		$contextMenu1.hide();
	});

	var hidWidth;
	var scrollBarWidths = 40;

	var widthOfList = function() {
		var itemsWidth = 0;
		$('.list li').each(function() {
			var itemWidth = $(this).outerWidth();
			itemsWidth += itemWidth;
		});
		return itemsWidth;
	};

	var widthOfHidden = function() {
		return (($('.wrapper').outerWidth()) - widthOfList() - getLeftPosi()) - scrollBarWidths;
	};

	var getLeftPosi = function() {
		return $('.list').position().left;
	};

	var reAdjust = function() {
		if (($('.wrapper').outerWidth()) < widthOfList()) {
			$('.scroller-right').show();
		} else {
			$('.scroller-right').hide();
		}

		if (getLeftPosi() < 0) {
			$('.scroller-left').show();
		} else {
			$('.item').animate({
				left : "-=" + getLeftPosi() + "px"
			}, 'slow');
			$('.scroller-left').hide();
		}
	}
	reAdjust();

	$(window).on('resize', function(e) {
		reAdjust();
	});

	$('.scroller-right').click(function() {
		$('.scroller-left').fadeIn('slow');
		$('.scroller-right').fadeOut('slow');

		$('.list').animate({
			left : "+=" + widthOfHidden() + "px"
		}, 'slow', function() {

		});
	});

	$('.scroller-left').click(function() {

		$('.scroller-right').fadeIn('slow');
		$('.scroller-left').fadeOut('slow');

		$('.list').animate({
			left : "-=" + getLeftPosi() + "px"
		}, 'slow', function() {

		});
	});

	/*$(document).ready(function() {
	 $("div.bhoechie-tab-menu>div.list-group>a").click(function(e) {
	 e.preventDefault();
	 $(this).siblings('a.active').removeClass("active");
	 $(this).addClass("active");
	 var index = $(this).index();
	 $("div.bhoechie-tab>div.bhoechie-tab-content").removeClass("active");
	 $("div.bhoechie-tab>div.bhoechie-tab-content").eq(index).addClass("active");
	 });
	 });*/

	$('#input03').filestyle({
		input : false,
		buttonName : 'btn-primary'
	});

});
