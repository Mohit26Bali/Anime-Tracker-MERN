function Footer() {
  return (
    <footer className="border-t border-stone-800 bg-stone-950 px-6 py-6 text-center text-xs text-stone-500 sm:px-12">
      <p>Anime Tracker — Built with React · Express · MongoDB · AniList GraphQL API</p>
      <p className="mt-1">
        Anime data provided by{" "}
        <a
          href="https://anilist.co"
          target="_blank"
          rel="noreferrer"
          className="text-stone-400 hover:text-orange-400 hover:underline"
        >
          AniList
        </a>
        . Not affiliated with AniList.
      </p>
    </footer>
  );
}

export default Footer;
