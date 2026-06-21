#!/usr/bin/env python3
"""
_real_universities_seed.py
--------------------------
REAL, source-based institution seed for TestPrep Admissions.

Provenance
==========
1. `FETCHED_*` blocks were gathered via live web research (Wikipedia "List of
   universities in X" pages + city lists) during the initial build. Each block
   records the exact `source_url` it came from. These are real institutions with
   real cities / founding context.
2. `CURATED_FLAGSHIPS` are well-known, verifiable institutions with their real
   official domains. Their *identity* (name, city, country, website) is verified;
   their *admission requirements* are NOT — those remain "Doğrulama gerekli".

Anti-fabrication rule
=====================
We never invent admission requirements, scores, deadlines or scholarship amounts.
Every admissions-content field defaults to "Doğrulama gerekli" until a human curates
it against an official, cited source.

Each tuple: (name, country_code, city, raw_type, website_or_None, source_url)
website=None  -> website unverified -> "Doğrulama gerekli"
"""

WIKI = "https://en.wikipedia.org/wiki/List_of_universities_in_"
WIKI_NL = WIKI + "the_Netherlands"
WIKI_TR = "https://en.wikipedia.org/wiki/List_of_universities_in_Turkey"
WIKI_IST = "https://en.wikipedia.org/wiki/List_of_universities_in_Istanbul"
WIKI_ANK = "https://en.wikipedia.org/wiki/List_of_universities_in_Ankara"

# --- Netherlands (fetched: WIKI_NL) ----------------------------------------
FETCHED_NL = [
    ("University of Amsterdam", "NL", "Amsterdam", "research university", "https://www.uva.nl", WIKI_NL),
    ("Vrije Universiteit Amsterdam", "NL", "Amsterdam", "research university", "https://www.vu.nl", WIKI_NL),
    ("University of Groningen", "NL", "Groningen", "research university", "https://www.rug.nl", WIKI_NL),
    ("Leiden University", "NL", "Leiden", "research university", "https://www.universiteitleiden.nl", WIKI_NL),
    ("Maastricht University", "NL", "Maastricht", "research university", "https://www.maastrichtuniversity.nl", WIKI_NL),
    ("Radboud University", "NL", "Nijmegen", "research university", "https://www.ru.nl", WIKI_NL),
    ("Erasmus University Rotterdam", "NL", "Rotterdam", "research university", "https://www.eur.nl", WIKI_NL),
    ("Tilburg University", "NL", "Tilburg", "research university", "https://www.tilburguniversity.edu", WIKI_NL),
    ("Utrecht University", "NL", "Utrecht", "research university", "https://www.uu.nl", WIKI_NL),
    ("Delft University of Technology", "NL", "Delft", "technical university", "https://www.tudelft.nl", WIKI_NL),
    ("Eindhoven University of Technology", "NL", "Eindhoven", "technical university", "https://www.tue.nl", WIKI_NL),
    ("University of Twente", "NL", "Enschede", "technical university", "https://www.utwente.nl", WIKI_NL),
    ("Wageningen University & Research", "NL", "Wageningen", "technical university", "https://www.wur.nl", WIKI_NL),
    ("Open University in the Netherlands", "NL", "Heerlen", "open university", "https://www.ou.nl", WIKI_NL),
    ("University of Humanistic Studies", "NL", "Utrecht", "research university", "https://www.uvh.nl", WIKI_NL),
    ("Nyenrode Business University", "NL", "Breukelen", "business school", "https://www.nyenrode.nl", WIKI_NL),
    ("Amsterdam University of Applied Sciences", "NL", "Amsterdam", "university of applied sciences", "https://www.hva.nl", WIKI_NL),
    ("The Hague University of Applied Sciences", "NL", "The Hague", "university of applied sciences", "https://www.thehagueuniversity.com", WIKI_NL),
    ("Rotterdam University of Applied Sciences", "NL", "Rotterdam", "university of applied sciences", "https://www.hogeschoolrotterdam.nl", WIKI_NL),
    ("Fontys University of Applied Sciences", "NL", "Eindhoven", "university of applied sciences", "https://www.fontys.edu", WIKI_NL),
    ("Hanze University of Applied Sciences", "NL", "Groningen", "university of applied sciences", "https://www.hanze.nl", WIKI_NL),
    ("Saxion University of Applied Sciences", "NL", "Enschede", "university of applied sciences", "https://www.saxion.edu", WIKI_NL),
    ("Design Academy Eindhoven", "NL", "Eindhoven", "academy", "https://www.designacademy.nl", WIKI_NL),
    ("Gerrit Rietveld Academie", "NL", "Amsterdam", "academy", "https://rietveldacademie.nl", WIKI_NL),
]

# --- Turkey (fetched: WIKI_TR / WIKI_IST / WIKI_ANK) ------------------------
FETCHED_TR = [
    ("Istanbul University", "TR", "İstanbul", "public university", "https://www.istanbul.edu.tr", WIKI_IST),
    ("Istanbul University-Cerrahpaşa", "TR", "İstanbul", "public university", "https://www.iuc.edu.tr", WIKI_IST),
    ("Boğaziçi University", "TR", "İstanbul", "public university", "https://www.boun.edu.tr", WIKI_IST),
    ("Istanbul Technical University", "TR", "İstanbul", "technical university", "https://www.itu.edu.tr", WIKI_IST),
    ("Marmara University", "TR", "İstanbul", "public university", "https://www.marmara.edu.tr", WIKI_IST),
    ("Yıldız Technical University", "TR", "İstanbul", "technical university", "https://www.yildiz.edu.tr", WIKI_IST),
    ("Galatasaray University", "TR", "İstanbul", "public university", "https://www.gsu.edu.tr", WIKI_IST),
    ("Mimar Sinan Fine Arts University", "TR", "İstanbul", "fine arts university", "https://www.msgsu.edu.tr", WIKI_IST),
    ("Istanbul Medeniyet University", "TR", "İstanbul", "public university", "https://www.medeniyet.edu.tr", WIKI_IST),
    ("Turkish-German University", "TR", "İstanbul", "public university", "https://www.tau.edu.tr", WIKI_IST),
    ("Koç University", "TR", "İstanbul", "foundation university", "https://www.ku.edu.tr", WIKI_IST),
    ("Sabancı University", "TR", "İstanbul", "foundation university", "https://www.sabanciuniv.edu", WIKI_IST),
    ("Bahçeşehir University", "TR", "İstanbul", "foundation university", "https://www.bau.edu.tr", WIKI_IST),
    ("Acıbadem University", "TR", "İstanbul", "foundation university", "https://www.acibadem.edu.tr", WIKI_IST),
    ("Kadir Has University", "TR", "İstanbul", "foundation university", "https://www.khas.edu.tr", WIKI_IST),
    ("Özyeğin University", "TR", "İstanbul", "foundation university", "https://www.ozyegin.edu.tr", WIKI_IST),
    ("Istanbul Medipol University", "TR", "İstanbul", "foundation university", "https://www.medipol.edu.tr", WIKI_IST),
    ("Ankara University", "TR", "Ankara", "public university", "https://www.ankara.edu.tr", WIKI_ANK),
    ("Gazi University", "TR", "Ankara", "public university", "https://www.gazi.edu.tr", WIKI_ANK),
    ("Middle East Technical University", "TR", "Ankara", "technical university", "https://www.metu.edu.tr", WIKI_ANK),
    ("Hacettepe University", "TR", "Ankara", "public university", "https://www.hacettepe.edu.tr", WIKI_ANK),
    ("Ankara Yıldırım Beyazıt University", "TR", "Ankara", "public university", "https://www.aybu.edu.tr", WIKI_ANK),
    ("Social Sciences University of Ankara", "TR", "Ankara", "public university", "https://www.asbu.edu.tr", WIKI_ANK),
    ("Bilkent University", "TR", "Ankara", "foundation university", "https://www.bilkent.edu.tr", WIKI_ANK),
    ("Başkent University", "TR", "Ankara", "foundation university", "https://www.baskent.edu.tr", WIKI_ANK),
    ("Atılım University", "TR", "Ankara", "foundation university", "https://www.atilim.edu.tr", WIKI_ANK),
    ("Çankaya University", "TR", "Ankara", "foundation university", "https://www.cankaya.edu.tr", WIKI_ANK),
    ("TOBB University of Economics and Technology", "TR", "Ankara", "foundation university", "https://www.etu.edu.tr", WIKI_ANK),
    ("TED University", "TR", "Ankara", "foundation university", "https://www.tedu.edu.tr", WIKI_ANK),
    ("Anadolu University", "TR", "Eskişehir", "public university", "https://www.anadolu.edu.tr", WIKI_TR),
    ("Çukurova University", "TR", "Adana", "public university", "https://www.cu.edu.tr", WIKI_TR),
    ("Ege University", "TR", "İzmir", "public university", "https://www.ege.edu.tr", WIKI_TR),
    ("Dokuz Eylül University", "TR", "İzmir", "public university", "https://www.deu.edu.tr", WIKI_TR),
    ("İzmir Institute of Technology", "TR", "İzmir", "institute of technology", "https://www.iyte.edu.tr", WIKI_TR),
]

# --- Curated verified flagships (identity verified via official domain) ------
CUR = "__CURATED__"  # marker: source is the official website itself
CURATED_FLAGSHIPS = [
    # United States
    ("Harvard University", "US", "Cambridge, MA", "private university", "https://www.harvard.edu", CUR),
    ("Massachusetts Institute of Technology", "US", "Cambridge, MA", "private university", "https://www.mit.edu", CUR),
    ("Stanford University", "US", "Stanford, CA", "private university", "https://www.stanford.edu", CUR),
    ("Yale University", "US", "New Haven, CT", "private university", "https://www.yale.edu", CUR),
    ("Princeton University", "US", "Princeton, NJ", "private university", "https://www.princeton.edu", CUR),
    ("Columbia University", "US", "New York, NY", "private university", "https://www.columbia.edu", CUR),
    ("University of California, Berkeley", "US", "Berkeley, CA", "public university", "https://www.berkeley.edu", CUR),
    ("University of California, Los Angeles", "US", "Los Angeles, CA", "public university", "https://www.ucla.edu", CUR),
    ("University of Chicago", "US", "Chicago, IL", "private university", "https://www.uchicago.edu", CUR),
    ("University of Michigan", "US", "Ann Arbor, MI", "public university", "https://umich.edu", CUR),
    ("Cornell University", "US", "Ithaca, NY", "private university", "https://www.cornell.edu", CUR),
    ("New York University", "US", "New York, NY", "private university", "https://www.nyu.edu", CUR),
    # United Kingdom
    ("University of Oxford", "GB", "Oxford", "public university", "https://www.ox.ac.uk", CUR),
    ("University of Cambridge", "GB", "Cambridge", "public university", "https://www.cam.ac.uk", CUR),
    ("Imperial College London", "GB", "London", "public university", "https://www.imperial.ac.uk", CUR),
    ("University College London", "GB", "London", "public university", "https://www.ucl.ac.uk", CUR),
    ("London School of Economics and Political Science", "GB", "London", "public university", "https://www.lse.ac.uk", CUR),
    ("University of Edinburgh", "GB", "Edinburgh", "public university", "https://www.ed.ac.uk", CUR),
    ("King's College London", "GB", "London", "public university", "https://www.kcl.ac.uk", CUR),
    ("University of Manchester", "GB", "Manchester", "public university", "https://www.manchester.ac.uk", CUR),
    ("University of Warwick", "GB", "Coventry", "public university", "https://warwick.ac.uk", CUR),
    ("University of Bristol", "GB", "Bristol", "public university", "https://www.bristol.ac.uk", CUR),
    # Canada
    ("University of Toronto", "CA", "Toronto", "public university", "https://www.utoronto.ca", CUR),
    ("University of British Columbia", "CA", "Vancouver", "public university", "https://www.ubc.ca", CUR),
    ("McGill University", "CA", "Montreal", "public university", "https://www.mcgill.ca", CUR),
    ("University of Waterloo", "CA", "Waterloo", "public university", "https://uwaterloo.ca", CUR),
    ("University of Alberta", "CA", "Edmonton", "public university", "https://www.ualberta.ca", CUR),
    # Germany
    ("Technical University of Munich", "DE", "Munich", "technical university", "https://www.tum.de", CUR),
    ("Ludwig Maximilian University of Munich", "DE", "Munich", "public university", "https://www.lmu.de", CUR),
    ("Heidelberg University", "DE", "Heidelberg", "public university", "https://www.uni-heidelberg.de", CUR),
    ("Humboldt University of Berlin", "DE", "Berlin", "public university", "https://www.hu-berlin.de", CUR),
    ("RWTH Aachen University", "DE", "Aachen", "technical university", "https://www.rwth-aachen.de", CUR),
    ("Free University of Berlin", "DE", "Berlin", "public university", "https://www.fu-berlin.de", CUR),
    # Switzerland
    ("ETH Zurich", "CH", "Zurich", "technical university", "https://ethz.ch", CUR),
    ("EPFL", "CH", "Lausanne", "technical university", "https://www.epfl.ch", CUR),
    ("University of Zurich", "CH", "Zurich", "public university", "https://www.uzh.ch", CUR),
    # Australia
    ("University of Melbourne", "AU", "Melbourne", "public university", "https://www.unimelb.edu.au", CUR),
    ("University of Sydney", "AU", "Sydney", "public university", "https://www.sydney.edu.au", CUR),
    ("Australian National University", "AU", "Canberra", "public university", "https://www.anu.edu.au", CUR),
    ("University of New South Wales", "AU", "Sydney", "public university", "https://www.unsw.edu.au", CUR),
    # Singapore / Japan / HK
    ("National University of Singapore", "SG", "Singapore", "public university", "https://www.nus.edu.sg", CUR),
    ("Nanyang Technological University", "SG", "Singapore", "technical university", "https://www.ntu.edu.sg", CUR),
    ("University of Tokyo", "JP", "Tokyo", "public university", "https://www.u-tokyo.ac.jp", CUR),
    ("University of Hong Kong", "HK", "Hong Kong", "public university", "https://www.hku.hk", CUR),
    # Ireland / France / Italy / Belgium / Netherlands flagship already above
    ("Trinity College Dublin", "IE", "Dublin", "public university", "https://www.tcd.ie", CUR),
    ("University College Dublin", "IE", "Dublin", "public university", "https://www.ucd.ie", CUR),
    ("Sciences Po", "FR", "Paris", "public university", "https://www.sciencespo.fr", CUR),
    ("Sorbonne University", "FR", "Paris", "public university", "https://www.sorbonne-universite.fr", CUR),
    ("PSL University", "FR", "Paris", "public university", "https://psl.eu", CUR),
    ("Bocconi University", "IT", "Milan", "private university", "https://www.unibocconi.it", CUR),
    ("Politecnico di Milano", "IT", "Milan", "technical university", "https://www.polimi.it", CUR),
    ("Sapienza University of Rome", "IT", "Rome", "public university", "https://www.uniroma1.it", CUR),
    ("KU Leuven", "BE", "Leuven", "public university", "https://www.kuleuven.be", CUR),
    # Scandinavia / Austria / Spain
    ("Karolinska Institute", "SE", "Stockholm", "public university", "https://ki.se", CUR),
    ("KTH Royal Institute of Technology", "SE", "Stockholm", "technical university", "https://www.kth.se", CUR),
    ("Lund University", "SE", "Lund", "public university", "https://www.lunduniversity.lu.se", CUR),
    ("University of Copenhagen", "DK", "Copenhagen", "public university", "https://www.ku.dk", CUR),
    ("University of Oslo", "NO", "Oslo", "public university", "https://www.uio.no", CUR),
    ("University of Vienna", "AT", "Vienna", "public university", "https://www.univie.ac.at", CUR),
    ("University of Barcelona", "ES", "Barcelona", "public university", "https://www.ub.edu", CUR),
    ("Complutense University of Madrid", "ES", "Madrid", "public university", "https://www.ucm.es", CUR),
    # Turkey flagships (curated identity)
    ("İhsan Doğramacı Bilkent University", "TR", "Ankara", "foundation university", "https://www.bilkent.edu.tr", CUR),
]

# A curated allow-list of institutions we treat as institution_category =
# "curated_university" (premium SSG pages). Matched by exact name.
CURATED_PRIORITY_NAMES = {name for (name, *_rest) in CURATED_FLAGSHIPS} | {
    "Boğaziçi University", "Middle East Technical University", "Koç University",
    "Sabancı University", "Istanbul Technical University",
    "Delft University of Technology", "University of Amsterdam", "Leiden University",
}

ALL = FETCHED_NL + FETCHED_TR + CURATED_FLAGSHIPS
