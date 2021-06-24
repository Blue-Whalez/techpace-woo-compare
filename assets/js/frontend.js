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

		widgetAddProduct: function (productID) {
			var data = {
				action: "wc_products_compare_add_product_ajax",
				ajaxAddProductNonce: wc_products_compare_local.ajaxAddProductNonce,
				product_id: productID,
			};

			$.post(wc_products_compare_local.ajaxurl, data, function (response) {
				if (response.length) {
					var widget = $(".woocommerce-products-compare-widget");

					// if product does not already exist add it
					if (
						$(widget).find('li[data-product-id="' + productID + '"]')
							.length == 0
					) {
						if ($(widget).find(".no-products").length) {
							// remove no products message
							$(widget).find(".no-products").remove();

							// add in the product
							$(widget)
								.find(
									"a.woocommerce-products-compare-widget-compare-button",
								)
								.before(
									"<ul>" +
										response +
										'</ul><a href="#" title="' +
										wc_products_compare_local.widgetRemoveProducts +
										'" class="woocommerce-products-compare-remove-all-products">' +
										wc_products_compare_local.widgetRemoveProducts +
										"</a>",
								);
						} else {
							// add in the product
							$(widget).find("ul").append(response);
						}
					}
				}
			});
		},

		widgetReset: function () {
			$(".woocommerce-products-compare-widget p.no-products").remove();
			$(".woocommerce-products-compare-widget ul").remove();
			$(
				".woocommerce-products-compare-widget a.woocommerce-products-compare-widget-compare-button",
			).before(
				'<p class="no-products">' +
					wc_products_compare_local.widgetNoProducts +
					"</p>",
			);
			$(
				".woocommerce-products-compare-widget .woocommerce-products-compare-remove-all-products",
			).remove();
		},

		widgetRemoveProduct: function (productID) {
			$(".woocommerce-products-compare-widget")
				.find('li[data-product-id="' + productID + '"]')
				.fadeOut("fast", function () {
					$(this).remove();
				});

			// check if there are no more products to compare
			if (
				$.wc_products_compare_frontend.getComparedProducts() === false ||
				$.wc_products_compare_frontend.getComparedProducts().length <= 0
			) {
				$.wc_products_compare_frontend.widgetReset();
			}
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
				console.log("check", count_cookies);
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
						console.log(wc_products_compare_local.endpoint);
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
						//check số lượng
						let compare_list =
							$.wc_products_compare_frontend.getComparedProducts();
						let count_items = compare_list.length - 1;
						//console.log(count_items);
						if (count_items < 3) {
							let this_product = {
								name: $(this).data("product-name"),
								url: $(this).data("product-link"),
								img: $(this).data("product-image-url"),
								id: $(this).data("product-id"),
							};
							//console.log('clicked',this_product);
							//check trùng

							if (
								compare_list &&
								compare_list.includes(this_product.id.toString())
							) {
								popup_mess.text(
									"Bạn đã chọn sản phẩm này rồi, vui lòng chọn sản phẩm khác!",
								);
							} else {
								//add to UI
								let product_html = `<li class="techpace-compare-item" data-product-id="${this_product.id}">
								<a href="${this_product.url}" class="product-link">
								<div class="img-wrap"><div><img width="100" height="100" src="${this_product.img}" class="attachment-shop_thumbnail size-shop_thumbnail" alt="" loading="lazy"/></div></div>
								<h3>${this_product.name}</h3>
								</a>
								<span class="techpace-compare-item__remove" href="#" title="Remove Product"  onclick="removeCompare(${this_product.id}, event)">x</span></li>`;
								popup_compare_list.append(product_html);
								//add to cookie
								$.wc_products_compare_frontend.setComparedProducts(
									this_product.id,
								);
								//add to widget
								$.wc_products_compare_frontend.widgetAddProduct(
									this_product.id,
								);

								console.log("added js", compare_list);
							}
						} else {
							popup_mess.text(
								"Vui lòng xóa bớt sản phẩm để tiếp tục so sánh!",
							);
						}
						//open
						console.log("open compare popup");
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
					//remove from widget
					$.wc_products_compare_frontend.widgetRemoveProduct(id);
					if (e) {
						popup_mess.text("");
						//remove FE
						$(e.target).closest("li.techpace-compare-item").detach();
						checkAvailable(popup_compare_btn);
						checkAvailable(popup_remove_all);
						if (
							$.wc_products_compare_frontend.getComparedProducts()
								.length <= 1
						)
							popupClose();
					}
				};
				//REMOVE ALL PRODUCT
				popup_remove_all.on("click", function (e) {
					e.preventDefault();
					console.log("remove all");
					$(">li", popup_compare_list).each(function (i) {
						var removeID = $(this).data("product-id");

						// Unset the product from cookie.
						$.wc_products_compare_frontend.unsetComparedProducts(
							removeID,
						);

						// Remove product from widget.
						$.wc_products_compare_frontend.widgetRemoveProduct(removeID);

						//Remove from FE
						$(this).detach();

						// Uncheck compare checkbox.
						//$('input.woocommerce-products-compare-checkbox[data-product-id="' + removeID + '"]').prop('checked', false);
					}, popupClose());
				});
				//CLOSE POPUP
				popup_close.on("click", function () {
					popupClose();
				});
				//click outside
				// popup.on('click', function(e){
				// 	e.stopPropagation();
				// 	e.preventDefault();
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
				//console.log('không có cookie!')
				setCookie(wc_products_compare_local.cookieName, "false",wc_products_compare_local.cookieExpiry );
				location.reload();
			}
			// 	Add/remove products to compare
			$.wc_products_compare_frontend.popupCompare();
			// $('body').on('click', '.woocommerce-products-compare-compare-button input', function () {
			// 	// bail if cookies are not enabled
			// 	if (navigator.cookieEnabled === false) {
			// 		alert(wc_products_compare_local.noCookies);

			// 		return;
			// 	}

			// 	var product = $(this).parents('.product'),
			// 		productID = $(this).data('product-id');

			// 	// check if checkbox is checked
			// 	if ($(this).is(':checked')) {

			// 		// check if max product limit reached
			// 		if ($.wc_products_compare_frontend.getComparedProducts().length >= wc_products_compare_local.maxProducts) {
			// 			alert(wc_products_compare_local.maxAlert);

			// 			// uncheck the checkbox
			// 			$(this).prop('checked', false);
			// 		} else {
			// 			$.wc_products_compare_frontend.setComparedProducts(productID);

			// 			$.wc_products_compare_frontend.widgetAddProduct(productID);

			// 			$('body').trigger('wc_compare_product_checked', productID);
			// 		}

			// 	} else {
			// 		$.wc_products_compare_frontend.unsetComparedProducts(productID);

			// 		$.wc_products_compare_frontend.widgetRemoveProduct(productID);

			// 		$('body').trigger('wc_compare_product_unchecked', productID);
			// 	}

			// 	$('body').trigger('wc_compare_product_update', productID);
			// });

			// remove product from compare page
			$(".woocommerce-products-compare-content").on(
				"click",
				".remove-compare-product",
				function (e) {
					e.preventDefault();

					var removeID = $(this).data("remove-id"),
						columns = $(
							".woocommerce-products-compare-content thead tr:first-child",
						).find("th, td").length,
						column_width = Math.floor(100 / columns),
						removeRow;

					$(".woocommerce-products-compare-content")
						.find(
							'td[data-product-id="' +
								removeID +
								'"], th[data-product-id="' +
								removeID +
								'"]',
						)
						.fadeOut("fast", function () {
							// remove product column
							$(this).remove();
						});

					// unset the product from cookie
					$.wc_products_compare_frontend.unsetComparedProducts(removeID);

					// check if there are no more products to compare
					if (
						$.wc_products_compare_frontend.getComparedProducts() ===
							false ||
						$.wc_products_compare_frontend.getComparedProducts().length <=
							0
					) {
						// remove page with message
						$(".woocommerce-products-compare-content").html(
							wc_products_compare_local.noProducts,
						);
					}

					// remove any attribute rows that don't have data in all products
					$(
						".woocommerce-products-compare-content tbody tr, .woocommerce-products-compare-content thead tr",
					).each(function () {
						removeRow = true;

						// filter out the current product being removed
						$(this)
							.find("td")
							.not('[data-product-id="' + removeID + '"]')
							.each(function () {
								if ($(this).html().trim()) {
									removeRow = false;
								}
							});

						if (removeRow) {
							$(this).fadeOut("fast", function () {
								// remove row
								$(this).remove();
							});
						}
					});

					// set new column widths
					$(".woocommerce-products-compare-content thead tr:first-child")
						.find("th, td")
						.css("width", column_width + "%");
				},
			);

			// make sure there are more than 1 product to compare
			$("body").on(
				"click",
				".woocommerce-products-compare-compare-link",
				function () {
					if (
						$.wc_products_compare_frontend.getComparedProducts().length >
						1
					) {
						return true;
					} else {
						alert(wc_products_compare_local.moreProducts);

						return false;
					}
				},
			);

			/***** WIDGET *****/
			// check if more than one product to compare (widget)
			$("body").on(
				"click",
				".woocommerce-products-compare-widget-compare-button",
				function () {
					if (
						$.wc_products_compare_frontend.getComparedProducts().length >
						1
					) {
						return true;
					} else {
						alert(wc_products_compare_local.moreProducts);

						return false;
					}
				},
			);

			$(".woocommerce-products-compare-widget").on(
				"click",
				".remove-compare-product",
				function (e) {
					e.preventDefault();

					var removeID = $(this).data("remove-id");

					// unset the product from cookie
					$.wc_products_compare_frontend.unsetComparedProducts(removeID);

					// remove product from widget
					$.wc_products_compare_frontend.widgetRemoveProduct(removeID);

					// uncheck compare checkbox
					$(
						'input.woocommerce-products-compare-checkbox[data-product-id="' +
							removeID +
							'"]',
					).prop("checked", false);
				},
			);

			$(".woocommerce-products-compare-widget").on(
				"click",
				".woocommerce-products-compare-remove-all-products",
				function (e) {
					e.preventDefault();

					$(".woocommerce-products-compare-widget ul li").each(
						function (i) {
							var removeID = $(this).data("product-id");

							// Unset the product from cookie.
							$.wc_products_compare_frontend.unsetComparedProducts(
								removeID,
							);

							// Remove product from widget.
							$.wc_products_compare_frontend.widgetRemoveProduct(
								removeID,
							);

							// Uncheck compare checkbox.
							$(
								'input.woocommerce-products-compare-checkbox[data-product-id="' +
									removeID +
									'"]',
							).prop("checked", false);
						},
						function () {
							$.wc_products_compare_frontend.widgetReset();
						},
					);
				},
			);
		},
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
