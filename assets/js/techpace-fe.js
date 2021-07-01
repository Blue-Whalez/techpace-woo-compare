jQuery(document).ready(function ($) {
	"use strict";

	// create namespace to avoid any possible conflicts
	$.wc_products_compare_frontend = {
		getComparedProducts: function () {
			var products = $.cookie(wc_products_compare_local.cookieName);
			if (typeof products !== "undefined" && products.length) {
				return products.split(",");
			} else {
				return false;
			}
		},
		

		setComparedProducts: function (productID) {
			// get existing product list
			var products = $.wc_products_compare_frontend.getComparedProducts();

			// if nothing set, set it
			if (products === false) {
				products = [String(productID).trim()];

				// check if product is already listed
			} else if (products.indexOf(productID) === -1) {
				products.push(productID);
			}

			// set the cookie
			$.cookie.raw = true;
			$.cookie(wc_products_compare_local.cookieName, products.toString(), {
				expires: parseInt(wc_products_compare_local.cookieExpiry, 10),
				path: "/",
			});

			return true;
		},

		unsetComparedProducts: function (productID) {
			// get existing product list
			var products = $.wc_products_compare_frontend.getComparedProducts();

			// make sure ID exists
			if (products !== false && products.indexOf(String(productID)) !== -1) {
				// remove ID from array
				products.splice(products.indexOf(String(productID)), 1);
			}

			// set the cookie
			$.cookie.raw = true;
			$.cookie(wc_products_compare_local.cookieName, products.toString(), {
				expires: parseInt(wc_products_compare_local.cookieExpiry, 10),
				path: "/",
			});

			return true;
		},
		resetComparedProducts: function (){
			console.log('reset do khác cate');
			$.cookie.raw = true;
			$.cookie(wc_products_compare_local.cookieName, "false", {
				expires: parseInt(wc_products_compare_local.cookieExpiry, 10),
				path: "/",
			});

			return true;
		},
		getCateProducts: function () {
			var cate = $.cookie(wc_products_compare_local.cookieCateName);
			if (typeof cate !== "undefined" && cate.length) {
				return cate;
			} else {
				return false;
			}
		},
		setCateProducts: function (cateSlug) {
			// get existing product list
			var cate = [String(cateSlug).trim()];

			// set the cookie
			$.cookie.raw = true;
			$.cookie(wc_products_compare_local.cookieCateName, cate.toString(), {
				expires: parseInt(wc_products_compare_local.cookieExpiry, 10),
				path: "/",
			});

			return true;
		},

		popupCompare: function (e) {
			let popup = $("#techpace-compare-popup");
			let popup_trigger = $(".techpace-compare-trigger");
			let popup_mess = $("#techpace-compare__mess", popup);
			let popup_close = $(".close-popup-btn", popup);
			let popup_compare_btn = $(".techpace-compare__button", popup);
			let popup_compare_list = $("ul.techpace-compare-list", popup);
			let popup_remove_all = $(".techpace-remove-all__button", popup);
			function popupClose() {
				if (popup.hasClass("active")) {
					popup_mess.text("");
					popup.removeClass("active");
				}
			}
			function checkAvailable(el) {
				let count_cookies =
					$.wc_products_compare_frontend.getComparedProducts().length - 1;
				if (count_cookies <= 1) {
					if (!el.hasClass("disabled")) {
						el.addClass("disabled");
						if (el.hasClass("techpace-compare__button"))
							el.attr("href", "javascript:void(0)");
					}
				} else {
					if (el.hasClass("disabled")) {
						el.removeClass("disabled");
						if (el.hasClass("techpace-compare__button"))
							el.attr("href", wc_products_compare_local.endpoint);
					}
				}
			}
			//Popup bật lên, xử lý add / remove sản phẩm vào list chọn
			if (popup.length && popup_trigger.length) {
				popup_trigger.on("click", function () {
					if (navigator.cookieEnabled === false) {
						alert(wc_products_compare_local.noCookies);
						return;
					}
					
					if (!popup.hasClass("active")) {
						//add product on UI
						//check trùng cate
						let cate = $.wc_products_compare_frontend.getCateProducts();
						console.log(cate +" vs this: "+ $(this).data("product-cate"));
						if(cate != $(this).data("product-cate")){
							//NẾU KHÁC RESET ALL
							popup_mess.text(
								"Chỉ có thể so sánh sản phẩm cùng nhóm hàng. Sản phẩm trước đã được xoá khỏi giỏ so sánh.",
								);
								setTimeout(function(){
									popup_mess.text("");
								}, 2000)
								removeAll();
								
						}
						
						//check số lượng
						let compare_list =
						$.wc_products_compare_frontend.getComparedProducts();
						let count_items = compare_list.length - 1;
						console.log('count cookie', count_items);
						if (count_items < 3) {
							let this_product = {
								name: $(this).data("product-name"),
								cate: $(this).data("product-cate"),
								url: $(this).data("product-link"),
								img: $(this).data("product-image-url"),
								id: $(this).data("product-id"),
							};
							//console.log('clicked',this_product);
						
							//Check trùng sp
							if (
								compare_list &&
								compare_list.includes(this_product.id.toString())
							) {
								popup_mess.text(
									"Bạn đã chọn sản phẩm này rồi, vui lòng chọn sản phẩm khác!",
								);
							} else {
									//add to cookie
									$.wc_products_compare_frontend.setCateProducts(this_product.cate);
									$.wc_products_compare_frontend.setComparedProducts(
										this_product.id,
									);
									//add to UI
									let product_html = `<li class="techpace-compare-item" data-product-id="${this_product.id}">
									<a href="${this_product.url}" class="product-link">
									<div class="img-wrap"><div><img width="100" height="100" src="${this_product.img}" class="attachment-shop_thumbnail size-shop_thumbnail" alt="" loading="lazy"/></div></div>
									<h3>${this_product.name}</h3>
									</a>
									<span class="techpace-compare-item__remove" href="#" title="Remove Product"  onclick="removeCompare(${this_product.id}, event)">x</span></li>`;
									popup_compare_list.append(product_html);
								}
								console.log("added js", compare_list);
						} else {
							popup_mess.text(
								"Vui lòng xóa bớt sản phẩm để tiếp tục so sánh!",
							);
						}
						//open
						//console.log("open compare popup");
						popup.addClass("active");
					}
					checkAvailable(popup_compare_btn);
					checkAvailable(popup_remove_all);
				});
				//REMOVE PRODUCT
				window.removeCompare = (id, e) => {
					console.log("remove", id, e);
					e.preventDefault();
					//remove from cookie
					$.wc_products_compare_frontend.unsetComparedProducts(id);
					if (e) {
						popup_mess.text("");
						//remove FE
						$(e.target).closest("li.techpace-compare-item").detach();
						checkAvailable(popup_compare_btn);
						checkAvailable(popup_remove_all);
					}
					if (
						$.wc_products_compare_frontend.getComparedProducts()
							.length <= 1
					){
						popupClose();

					}
				};
				//REMOVE ALL PRODUCT
				function removeAll (){
					console.log("remove all");
					$(">li", popup_compare_list).each(function (i) {
						var removeID = $(this).data("product-id");
						console.log('remove item', removeID);
						// Unset the product from cookie.
						$.wc_products_compare_frontend.unsetComparedProducts(
							removeID
						);
						//Remove from FE
						$(this).detach();
					});
				};
				popup_remove_all.on("click", function (e) {
					e.preventDefault();
					removeAll(e), popupClose();
				});
				//CLOSE POPUP
				popup_close.on("click", function () {
					popupClose();
				});
				//click outside
				// popup.on('click', function(e){
				// 	e.stopPropagation();
				// 	e.preventDefault();
				// 	console.log('bấm vào nè', e.target);
				// 	var container = $(".techpace-compare-popup__wrapper", $(this));
				// 	// Nếu click bên ngoài đối tượng container thì ẩn nó đi
				// 	if (!container.is(e.target) && container.has(e.target).length === 0)
				// 	{
				// 		if(popup.hasClass('active')){
				// 			console.log('outside compare popup')
				// 			popup.removeClass('active');
				// 			popup_mess.text('');
				// 		}
				// 	}

				// })
			}
		},
		init: function () {
			
			//	Init cookie while non-exist
			let cookie = getCookie(wc_products_compare_local.cookieName);
			if(cookie==""){
				setCookie(wc_products_compare_local.cookieName, "false",wc_products_compare_local.cookieExpiry );
			}
			let cateCookie = getCookie(wc_products_compare_local.cookieCateName);
			if(cateCookie==""){
				setCookie(wc_products_compare_local.cookieCateName, "",wc_products_compare_local.cookieExpiry );
			}
			// 	Add/remove products to compare
			$.wc_products_compare_frontend.popupCompare();
			
        }
	}; // close namespace
	function setCookie(cname, cvalue, exdays) {
		const d = new Date();
		d.setTime(d.getTime() + (exdays*24*60*60*1000));
		let expires = "expires="+ d.toUTCString();
		document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
	  }
	function getCookie(cname) {
		let name = cname + "=";
		let decodedCookie = decodeURIComponent(document.cookie);
		let ca = decodedCookie.split(';');
		for(let i = 0; i <ca.length; i++) {
		  let c = ca[i];
		  while (c.charAt(0) == ' ') {
			c = c.substring(1);
		  }
		  if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		  }
		}
		return "";
	  }
	$.wc_products_compare_frontend.init();

	// end document ready
});
