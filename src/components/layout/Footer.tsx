function Footer() {
  return (
    <footer className="border-grid border-t py-6 mt-5 md:px-8 md:py-0">
      <div className="container-wrapper">
        <div className="py-4">
          <div className="flex flex-col justify-between text-balance text-center text-sm leading-loose text-muted-foreground md:flex-row md:text-left">
            <p>
              <span className="font-semibold">Bulletin +</span> est un projet
              open-source développé par{' '}
              <a
                href="https://github.com/LucasDebeve"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline hover:underline-offset-4"
              >
                Lucas Debeve
              </a>
              .
            </p>
            <p>
              <a
                href="https://github.com/LucasDebeve/bulletin-plus"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary md:text-right hover:underline hover:underline-offset-4"
              >
                Voir le code source
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
