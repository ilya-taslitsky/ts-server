interface TokenData {
    mint: string;
    pool: string;
}

export class TokenMints {
    private static readonly tokenMap: Record<string, TokenData> = {
        AART: {
            mint: "F3nefJBcejYbtdREjui1T9DPh5dBgpkKq7u2GAAMXs5B",
            pool: "2tpF88VHajuuv8Ad1wHMq3NmxyRLfSdqv6Jy4X6xc7p1"
        },
        ANALOS: {
            mint: "7iT1GRYYhEop2nV1dyCwK2MGyLmPHq47WhPGSwiqcUg5",
            pool: "CJekng8RZh3CEBzyExtxFugw4GKBRiCKqXw5eSeVVkyS"
        },
        AURY: {
            mint: "AURYydfxJib1ZkTir1Jn1J9ECYUtjb6rKQVmtYaixWPP",
            pool: "Gr7WKYBqRLt7oUkjZ54LSbiUf8EgNWcj3ogtN8dKbfeb"
        },
        ORCA: {
            mint: "orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE",
            pool: "5Z66YYYaTmmx1R4mATAGLSc8aV4Vfy5tNdJQzk1GP9RF"
        },
        POLIS: {
            mint: "poLisWXnNRwC6oBu1vHiuKQzFjGL4XDSu4g9qjz9qVk",
            pool: "4dMCeFsjsGgakprFMtTY4uwuRL2p55Y6pJuQBcUFyu1v"
        },
        PONKE: {
            mint: "5z3EqYQo9HiCEs3R84RCDMu2n7anpDMxRhdK8PSWmrRC",
            pool: "CsJTG4mospaCYvwQghmL5SAqh8YUkBw6YyzBrbfvTDSN"
        },
        RAY: {
            mint: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
            pool: "A2J7vmG9xAdWUzYscN7oQssxZBFihwD3UonkWB8Kod1A"
        },
        SONAR: {
            mint: "sonarX4VtVkQemriJeLm6CKeW3GDMyiBnnAEMw1MRAE",
            pool: "4XGVZQ5haGEJEYD1vftQD4FNU4uhBQguJePVQRu27z2Q"
        },
        SS20: {
            mint: "6YsbefsCddFqUGyMxd788LQHbCGsGgmzjr5cowpYqRhk",
            pool: "HogdrdY5fxb7H1mEx7GMbHfEuP5ADwab18Yz6rVv7j2P"
        },
        SRM: {
            mint: "SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt",
            pool: "F9E8wmvm4j9s6NmVzcPjNWoXpjTYeJjXJAqvodR7GQhx"
        },
        SOL: {
            mint: "So11111111111111111111111111111111111111112",
            pool: "FpCMFDFGYotvufJ7HrFHsWEiiQCGbkLCtwHiDnh7o28Q"
        }
    };

    static getMint(tokenName: string): string {
        return this.tokenMap[tokenName.toUpperCase()]?.mint;
    }

    static getPool(tokenName: string): string  {
        return this.tokenMap[tokenName.toUpperCase()]?.pool;
    }

    static getTokenData(tokenName: string): TokenData {
        return this.tokenMap[tokenName.toUpperCase()];
    }
}
