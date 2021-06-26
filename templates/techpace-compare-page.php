<?php
/**
 * The compare page template file
 *
 * @version 1.0.8
 * @since 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

get_header( 'shop' ); ?>

<noscript><?php esc_html_e( 'Sorry, you must have Javascript enabled in your browser to use compare products', 'woocommerce-products-compare' ); ?></noscript>

<div class="row row-collapse techpace-compare-page woocommerce">
	<?php

	$products = WC_Products_Compare_Frontend::get_compared_products();
	if ( $products && count($products)>=1) {
		global $product;

		$columns = 'col-'.(count($products)-1);

		// Get all row headers.
		$headers = WC_Products_Compare_Frontend::get_product_meta_headers( $products );
		define('EXCLUDE_ATTR', array('description', 'sku'));
		$headers = array_diff($headers, EXCLUDE_ATTR );
	?>
		<div class="compare-main <?php echo esc_attr($columns); ?>">
		<div class="compare-main__head">
			<ul class="compare-row product-row">
				<?php foreach ( $products as $product ) {
						$product = wc_get_product( $product );

						if ( ! WC_Products_Compare::is_product( $product ) ) {
							continue;
						}
				?>
					<li data-product-id="<?php echo esc_attr( $product->get_id() ); ?>">
						<a href="<?php echo get_permalink( $product->get_id() ); ?>" title="<?php echo esc_attr( $product->get_title() ); ?>" class="product-link">
						<?php do_action('techpace_compare_product_badge')?>
						<div class="img-wrap">
							<?php echo $product->get_image( 'shop_single' ); ?>
						</div>
						<h3><?php echo $product->get_title(); ?></h3>
						<?php woocommerce_template_loop_price(); ?>
						<?php
							// Don't show rating row if all products don't have ratings.
							/*$show_rating = false;

							if ( $product->get_average_rating() > 0 ) {
								$show_rating = true;
							}
							
							if ( $show_rating ) { ?>
								<div class="products ratings-row">
										<td class="product" data-product-id="<?php echo esc_attr( $product->get_id() ); ?>">
											<?php if ( $product->get_average_rating() > 0 ) { woocommerce_template_loop_rating(); } ?>
										</td>
									
							<?php }*/?>
						</a>
					</li>
				<?php } ?>
			</ul>
		</div>
		<div class="compare-main__content">
		<strong>Thông số kỹ thuật chi tiết</strong>
			<?php foreach ( $headers as  $header ) { ?>
				<div class="attribute-row" data-product-id="<?php echo esc_attr( $product->get_id() ); ?>">
					<div class="compare-row attribute-row__name">
						<?php foreach ( $products as $index => $product ) {
							$product = wc_get_product( $product );

							if ( ! WC_Products_Compare::is_product( $product ) ) {
								continue;
							}

							$post = get_post( $product->get_id() );
							$attributes = $product->get_attributes();
						?>	
								
								<div>
									<?php
										if($index==1){
											echo (WC_Products_Compare_Frontend::get_short_name( $header));
										}
									?>
								</div>
							
						<?php } ?>
					</div>
					<div class="compare-row attribute-row__value">
						<?php foreach ( $products as $index => $product ) {
							$product = wc_get_product( $product );

							if ( ! WC_Products_Compare::is_product( $product ) ) {
								continue;
							}

							$post = get_post( $product->get_id() );
							$attributes = $product->get_attributes();
						?>	
					
							<div>
								<?php
									if ( 'stock' === $header && $product->managing_stock() ) {
										$class = $product->get_availability()['class'];
										$availability = $product->get_availability()['availability'];

										echo '<span class="stock-status ' . esc_attr( $class ) . '">' . $availability . '</span>' . PHP_EOL;

									} elseif ( 'description' === $header ) {
										echo wp_strip_all_tags( $post->post_excerpt );

									} elseif ( 'sku' === $header ) {
										echo $product->get_sku();

									} elseif ( array_key_exists( sanitize_title( $header ), $attributes ) ) {

										if ( $attributes[ sanitize_title( $header ) ]['is_taxonomy'] ) {

											$values = wc_get_product_terms( $product->get_id(), $attributes[ sanitize_title( $header ) ]['name'], array( 'fields' => 'names' ) );
											echo apply_filters( 'woocommerce_attribute', wpautop( wptexturize( implode( ', ', $values ) ) ), $attributes[ sanitize_title( $header ) ], $values );
										} else {

											// Convert pipes to commas and display values.
											$values = array_map( 'trim', explode( WC_DELIMITER, $attributes[ sanitize_title( $header ) ]['value'] ) );
											echo apply_filters( 'woocommerce_attribute', wpautop( wptexturize( implode( ', ', $values ) ) ), $attributes[ sanitize_title( $header ) ], $values );
										}
									}
									?>
							</div>
						<?php } ?>
					</div>
				</div>
				
			<?php } ?>
		</div>
		<div class="compare-main__foot">
			<div class="compare-row price-row">
				<?php foreach ( $products as $product ) {
						$product = wc_get_product( $product );

						if ( ! WC_Products_Compare::is_product( $product ) ) {
							continue;
						}
				?>	
					<div data-product-id="<?php echo esc_attr( $product->get_id() ); ?>">
						<a href="<?php echo esc_attr(wc_get_cart_url().'?add-to-cart='.$product->get_id() );?>" class="button add_to_cart_button" data-quantity="1" data-product-id="<?php echo esc_attr( $product->get_id() );?>" rel="nofollow"><?php esc_html_e( 'Thêm vào giỏ', 'woocommerce-products-compare' ); ?></a>
					</div>
				<?php } ?>	
			</div>
		</div>
	<?php
	} else {

		echo WC_Products_Compare_Frontend::empty_message();
	}
	?>

</div><!--.woocommerce-products-compare-content-->

<?php get_footer( 'shop' ); ?>
