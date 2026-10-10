// The page grid.
//
// CONTAINER is the content column. The talking strip, the hero and every section use this exact class string, so
// their left and right edges line up at every screen width.
// max-w-[1416px] with 48px side padding puts the content about 300px from the edge on a 1920px screen.
// Below 1416px it simply fills the screen with the side padding.
export const CONTAINER = 'mx-auto w-full max-w-[1416px] px-5 md:px-12';

// FRAME is for the navigation bar and the footer. They frame the page, so they stay near the screen edges
// (48px) at any width while the content sits in its narrower column in between.
export const FRAME = 'w-full px-5 md:px-12';
