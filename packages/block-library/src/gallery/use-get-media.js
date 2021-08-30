/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

export default function useGetMedia( innerBlockImages ) {
	const [ currentImageMedia, setCurrentImageMedia ] = useState( [] );

	const imageMedia = useSelect(
		( select ) => {
			if (
				! innerBlockImages?.length ||
				innerBlockImages.some(
					( imageBlock ) => ! imageBlock.attributes.id
				)
			) {
				return currentImageMedia;
			}

			const imageIds = innerBlockImages.map(
				( imageBlock ) => imageBlock.attributes.id
			);

			if ( imageIds.length === 0 ) {
				return currentImageMedia;
			}

			return select( coreStore ).getMediaItems( {
				include: imageIds.join( ',' ),
				per_page: imageIds.length,
			} );
		},
		[ innerBlockImages ]
	);

	if (
		imageMedia?.length !== currentImageMedia?.length ||
		imageMedia?.some(
			( newImage ) =>
				! currentImageMedia.find(
					( currentImage ) => currentImage.id === newImage.id
				)
		)
	) {
		setCurrentImageMedia( imageMedia );
		return imageMedia;
	}
	return currentImageMedia;
}
