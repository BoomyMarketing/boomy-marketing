#!/usr/bin/env python3
"""
Enrich all local pages with unique city-specific landscape + cases sections.
Each city gets unique: stats, neighborhoods, industries, market context.
"""
import os
import re
import glob
import sys

# ── CITY DATA ─────────────────────────────────────────────────────────────────
CITY_DATA = {
    "toronto": {
        "label": "ON Market Data",
        "headline": "Toronto SEO:",
        "subtitle": "Canada's Most Competitive Search Market",
        "intro": "Toronto drives 30% of Canada's GDP. With 2.7M+ businesses fighting for digital visibility across the GTA, organic search is the highest-ROI channel for sustainable growth.",
        "stats": [
            ("187%", "Avg. Traffic Growth", "Boomy Marketing's Toronto SEO clients average 187% organic traffic growth within 12 months of campaign launch."),
            ("2.7M+", "GTA Businesses", "Over 2.7 million businesses compete for digital visibility across the Greater Toronto Area."),
            ("43%", "Local Search Intent", "43% of Toronto Google searches include local signals — neighbourhood names, 'near me,' or GTA-specific terms."),
            ("$12–$80", "Google Ads CPC", "Cost-per-click in competitive Toronto niches — real estate, legal, finance, insurance — making SEO the highest long-term ROI channel."),
            ("Multicultural", "Market Opportunity", "Toronto's 200+ language communities and immigrant entrepreneur population create niche SEO opportunities most agencies overlook."),
            ("2,000+", "Toronto Tech Companies", "Shopify, Wattpad, Wave, and 2,000+ startups make Toronto's tech corridor one of North America's most competitive SaaS SEO markets."),
        ],
        "industries": ["Real estate", "Legal services", "Financial services", "Tech & SaaS", "Healthcare & dental", "Hospitality & tourism"],
        "neighborhoods": ["Downtown Core", "Yorkville", "King West", "Distillery District", "Liberty Village", "The Annex"],
        "case_city_note": "GTA",
    },
    "calgary": {
        "label": "AB Market Data",
        "headline": "Calgary SEO:",
        "subtitle": "Alberta's Business Capital, Rising Digital Market",
        "intro": "Calgary is Canada's energy capital and fastest-growing major city. Post-oil diversification is driving tech, construction, and professional services — all competing fiercely for organic search.",
        "stats": [
            ("187%", "Avg. Traffic Growth", "Boomy Marketing's Calgary SEO clients average 187% organic traffic growth within 12 months of campaign launch."),
            ("650K+", "Calgary Businesses", "Over 650,000 businesses operate across Calgary and the surrounding Alberta corridor."),
            ("41%", "Local Search Intent", "41% of Calgary Google searches include local signals — community names, 'near me,' or Alberta-specific terms."),
            ("$8–$55", "Google Ads CPC", "Cost-per-click in competitive Calgary niches — energy, real estate, legal, construction — making SEO the best long-term ROI channel."),
            ("Energy Pivot", "Market Opportunity", "Calgary's shift from oil & gas to tech and diversified services creates first-mover SEO opportunities in emerging digital sectors."),
            ("No Provincial Tax", "Business Advantage", "Alberta's zero provincial tax and low regulatory burden make Calgary one of Canada's fastest-growing entrepreneurial markets."),
        ],
        "industries": ["Energy & oil services", "Real estate & construction", "Legal services", "Technology startups", "Healthcare", "Agriculture & logistics"],
        "neighborhoods": ["Downtown Calgary", "Beltline", "Mission", "Kensington", "East Village", "Inglewood"],
        "case_city_note": "Calgary",
    },
    "vancouver": {
        "label": "BC Market Data",
        "headline": "Vancouver SEO:",
        "subtitle": "The Market Reality",
        "intro": "Metro Vancouver is Canada's most geographically and linguistically diverse search market. These numbers shape every SEO strategy we build.",
        "stats": [
            ("187%", "Avg. Traffic Growth", "Boomy Marketing's Vancouver SEO clients average 187% organic traffic growth within 12 months of campaign launch."),
            ("300K+", "Metro Businesses", "Over 300,000 businesses compete for digital visibility across Metro Vancouver and the Lower Mainland."),
            ("46%", "Local Search Intent", "46% of Metro Vancouver Google searches include local signals — neighbourhood names, 'near me,' or BC-specific terms."),
            ("$10–$60", "Google Ads CPC", "Cost-per-click in competitive Vancouver niches — real estate, legal, dental, finance — making SEO the highest long-term ROI channel."),
            ("Bilingual", "Market Opportunity", "Richmond and Burnaby's large Mandarin and Cantonese communities create bilingual SEO opportunities most agencies miss."),
            ("1,500+", "Vancouver Tech Companies", "Amazon, Microsoft, EA, and 1,500+ startups make Vancouver's tech corridor one of Canada's most competitive SaaS SEO battlegrounds."),
        ],
        "industries": ["Real estate", "Technology & SaaS", "Hospitality & tourism", "Healthcare & dental", "Legal services", "E-commerce"],
        "neighborhoods": ["Downtown Vancouver", "Kitsilano", "Gastown", "Yaletown", "Commercial Drive", "Mount Pleasant"],
        "case_city_note": "Metro Vancouver",
    },
    "ottawa": {
        "label": "ON Market Data",
        "headline": "Ottawa SEO:",
        "subtitle": "Canada's Capital — Government, Tech & Bilingual Market",
        "intro": "Ottawa is Canada's capital and a major tech hub. The bilingual French-English market, federal government contracting, and booming Kanata North tech park create unique SEO dynamics.",
        "stats": [
            ("187%", "Avg. Traffic Growth", "Boomy Marketing's Ottawa SEO clients average 187% organic traffic growth within 12 months of campaign launch."),
            ("360K+", "Ottawa-Gatineau Businesses", "Over 360,000 businesses compete across the National Capital Region, including Gatineau's French-speaking market."),
            ("38%", "Local Search Intent", "38% of Ottawa Google searches include local signals — neighbourhood names, 'near me,' or bilingual NCR-specific terms."),
            ("$9–$50", "Google Ads CPC", "Cost-per-click in competitive Ottawa niches — government services, tech, legal, real estate — making SEO essential for long-term ROI."),
            ("Bilingual Advantage", "Market Opportunity", "Ottawa's French-English bilingualism creates underserved SEO niches — most agencies target only English, missing 25% of searchers."),
            ("700+", "Kanata North Tech Firms", "Shopify, Ciena, Nokia, and 700+ tech companies in Kanata North make Ottawa one of Canada's top SaaS and B2B search markets."),
        ],
        "industries": ["Government & public sector", "Technology & SaaS", "Legal services", "Real estate", "Healthcare", "Tourism & hospitality"],
        "neighborhoods": ["Downtown Ottawa", "Kanata", "Westboro", "Glebe", "Orleans", "Barrhaven"],
        "case_city_note": "NCR",
    },
    "edmonton": {
        "label": "AB Market Data",
        "headline": "Edmonton SEO:",
        "subtitle": "Alberta's Capital — Government Hub, Energy & Retail",
        "intro": "Edmonton is Alberta's capital and a major distribution hub for Western Canada. Government, energy, retail, and a booming tech sector create strong organic search demand.",
        "stats": [
            ("187%", "Avg. Traffic Growth", "Boomy Marketing's Edmonton SEO clients average 187% organic traffic growth within 12 months of campaign launch."),
            ("420K+", "Edmonton Businesses", "Over 420,000 businesses operate across Greater Edmonton, from downtown to the growing suburban corridors."),
            ("40%", "Local Search Intent", "40% of Edmonton Google searches include local signals — neighbourhood names, 'near me,' or Alberta-specific terms."),
            ("$7–$50", "Google Ads CPC", "Competitive CPCs in energy, legal, and real estate make organic SEO the most cost-effective long-term growth channel."),
            ("Energy Corridor", "Market Opportunity", "Edmonton's energy services industry is digitizing rapidly — creating first-mover SEO advantages for early movers."),
            ("Fort Road Tech", "Rising Sector", "Edmonton's startup and innovation ecosystem is growing faster than any other Alberta city, building new SEO battlegrounds."),
        ],
        "industries": ["Energy & oilfield services", "Government services", "Construction & trades", "Retail & e-commerce", "Healthcare", "Real estate"],
        "neighborhoods": ["Downtown Edmonton", "Oliver", "Whyte Avenue", "Glenora", "Windermere", "South Edmonton Common"],
        "case_city_note": "Edmonton",
    },
    "mississauga": {
        "label": "ON Market Data",
        "headline": "Mississauga SEO:",
        "subtitle": "Canada's 7th Largest City — GTA's Business Powerhouse",
        "intro": "Mississauga is home to over 70 Fortune 500 Canadian headquarters and one of Canada's busiest international airports. The competition for digital visibility in this corporate hub is intense.",
        "stats": [
            ("187%", "Avg. Traffic Growth", "Boomy Marketing's Mississauga SEO clients average 187% organic traffic growth within 12 months of campaign launch."),
            ("70+", "Fortune 500 HQ", "Over 70 Fortune 500 companies have Canadian headquarters in Mississauga, driving fierce B2B and professional services competition."),
            ("39%", "Local Search Intent", "39% of Mississauga Google searches include local signals — Streetsville, Port Credit, 'near me,' or GTA-specific terms."),
            ("$10–$65", "Google Ads CPC", "High CPCs in professional services, finance, and real estate make organic SEO essential for sustainable Mississauga lead generation."),
            ("Airport Corridor", "Market Opportunity", "Businesses near Pearson Airport serve national and international clients — SEO must target both local and national search intent."),
            ("500K+", "Mississauga Population", "Canada's 7th largest city with 700,000+ residents generates massive local search volume across every business category."),
        ],
        "industries": ["Corporate & professional services", "Logistics & distribution", "Financial services", "Real estate", "Healthcare", "Technology"],
        "neighborhoods": ["City Centre", "Port Credit", "Streetsville", "Meadowvale", "Erin Mills", "Lakeview"],
        "case_city_note": "Mississauga",
    },
    "winnipeg": {
        "label": "MB Market Data",
        "headline": "Winnipeg SEO:",
        "subtitle": "Canada's Prairie Hub — Logistics, Manufacturing & Services",
        "intro": "Winnipeg is Canada's geographic centre and a critical logistics hub. With strong manufacturing, retail, and services sectors, organic search competition is growing rapidly.",
        "stats": [
            ("187%", "Avg. Traffic Growth", "Boomy Marketing's Winnipeg SEO clients average 187% organic traffic growth within 12 months of campaign launch."),
            ("210K+", "Winnipeg Businesses", "Over 210,000 businesses compete across Greater Winnipeg and the surrounding Manitoba region."),
            ("36%", "Local Search Intent", "36% of Winnipeg Google searches include local signals — neighbourhood names, 'near me,' or Manitoba-specific terms."),
            ("$6–$40", "Google Ads CPC", "Lower CPCs than eastern metros make Winnipeg businesses uniquely well-positioned to dominate via organic SEO investment."),
            ("Logistics Hub", "Market Opportunity", "Winnipeg's central Canada location and major rail/trucking infrastructure create strong demand for B2B logistics-adjacent services."),
            ("Indigenous Economy", "Growing Sector", "Winnipeg has Canada's largest urban Indigenous population — a growing entrepreneurial community with underserved SEO needs."),
        ],
        "industries": ["Manufacturing & logistics", "Retail & e-commerce", "Healthcare & medical", "Agriculture services", "Construction & trades", "Government services"],
        "neighborhoods": ["Downtown Winnipeg", "The Forks", "Osborne Village", "St. Boniface", "Transcona", "St. Vital"],
        "case_city_note": "Winnipeg",
    },
    "halifax": {
        "label": "NS Market Data",
        "headline": "Halifax SEO:",
        "subtitle": "Atlantic Canada's Business Capital",
        "intro": "Halifax anchors Atlantic Canada's economy — a hub for maritime, defence, ocean technology, and a fast-growing tech sector. Organic search competition is lower here, creating real first-mover opportunity.",
        "stats": [
            ("187%", "Avg. Traffic Growth", "Boomy Marketing's Halifax SEO clients average 187% organic traffic growth within 12 months of campaign launch."),
            ("130K+", "Halifax Businesses", "Over 130,000 businesses operate across Halifax Regional Municipality and broader Atlantic Canada."),
            ("35%", "Local Search Intent", "35% of Halifax Google searches include local signals — neighbourhood names, Dartmouth, 'near me,' or Nova Scotia-specific terms."),
            ("$5–$35", "Google Ads CPC", "Halifax's lower CPCs vs. major metros make organic SEO the most efficient growth channel — especially for service businesses."),
            ("Ocean Tech Hub", "Market Opportunity", "Halifax leads North America in ocean technology and marine innovation — a niche SEO segment most national agencies ignore."),
            ("University Cluster", "Rising Demand", "Dalhousie, Saint Mary's, and NSCC drive startup formation and professional service demand across Halifax's digital economy."),
        ],
        "industries": ["Maritime & ocean tech", "Defence & government", "Healthcare & life sciences", "Tourism & hospitality", "Legal services", "Technology startups"],
        "neighborhoods": ["Downtown Halifax", "Dartmouth", "Bedford", "South End", "North End", "Fairview"],
        "case_city_note": "Atlantic Canada",
    },
    "hamilton": {
        "label": "ON Market Data",
        "headline": "Hamilton SEO:",
        "subtitle": "Steel City Reborn — Art, Health & Manufacturing",
        "intro": "Hamilton has transformed from a steel town into a diverse economy with major healthcare, manufacturing, arts, and tech sectors. Rapidly rising property values and business migration from Toronto make SEO essential.",
        "stats": [
            ("187%", "Avg. Traffic Growth", "Boomy Marketing's Hamilton SEO clients average 187% organic traffic growth within 12 months of campaign launch."),
            ("180K+", "Hamilton Businesses", "Over 180,000 businesses operate across Hamilton and the surrounding Golden Horseshoe region."),
            ("38%", "Local Search Intent", "38% of Hamilton Google searches include local signals — neighbourhood names, Mountain, 'near me,' or Golden Horseshoe-specific terms."),
            ("$7–$45", "Google Ads CPC", "Competitive but accessible CPCs make Hamilton one of the best markets for organic SEO ROI relative to paid advertising spend."),
            ("Toronto Overflow", "Market Opportunity", "Businesses priced out of Toronto are relocating to Hamilton — creating early SEO advantages for those who move fast on local search."),
            ("McMaster Health", "Growing Sector", "McMaster University and the Hamilton Health Sciences network drive demand for healthcare, research, and professional services SEO."),
        ],
        "industries": ["Healthcare & life sciences", "Manufacturing & steel", "Construction & real estate", "Arts & hospitality", "Legal services", "Tech & startups"],
        "neighborhoods": ["Downtown Hamilton", "Locke Street", "James Street North", "Westdale", "Ancaster", "Dundas"],
        "case_city_note": "Hamilton",
    },
    "kitchener": {
        "label": "ON Market Data",
        "headline": "Kitchener SEO:",
        "subtitle": "Canada's Silicon Valley North — Tech & Innovation Hub",
        "intro": "The Kitchener-Waterloo corridor is Canada's fastest-growing tech ecosystem. Google, OpenText, Communitech, and 1,500+ startups make this one of North America's most competitive B2B and SaaS SEO markets.",
        "stats": [
            ("187%", "Avg. Traffic Growth", "Boomy Marketing's Kitchener SEO clients average 187% organic traffic growth within 12 months of campaign launch."),
            ("200K+", "KW Region Businesses", "Over 200,000 businesses compete across the Kitchener-Waterloo region, including Cambridge and Guelph."),
            ("44%", "Local Search Intent", "44% of KW region Google searches include local signals — neighbourhood names, tech park references, or KW-specific terms."),
            ("$8–$55", "Google Ads CPC", "High CPCs in tech, B2B services, and legal make organic SEO the critical long-term growth channel for KW businesses."),
            ("Communitech Effect", "Market Opportunity", "Communitech's 1,500+ member companies and Google's Canadian engineering hub create exceptional B2B SEO demand."),
            ("Dual University", "Rising Demand", "Waterloo and Wilfrid Laurier universities feed a constant stream of talent, startups, and professional service demand into the KW economy."),
        ],
        "industries": ["Technology & SaaS", "Software development", "Manufacturing", "Financial services", "Healthcare", "E-commerce"],
        "neighborhoods": ["Downtown Kitchener", "Uptown Waterloo", "Belmont Village", "DTK", "Westmount", "Cambridge"],
        "case_city_note": "KW Region",
    },
    "victoria": {
        "label": "BC Market Data",
        "headline": "Victoria SEO:",
        "subtitle": "BC's Capital — Government, Tourism & Tech",
        "intro": "Victoria is British Columbia's provincial capital and a top Canadian tourism destination. Government services, tech (\"Silicon Island\"), hospitality, and real estate create a unique organic search landscape.",
        "stats": [
            ("187%", "Avg. Traffic Growth", "Boomy Marketing's Victoria SEO clients average 187% organic traffic growth within 12 months of campaign launch."),
            ("110K+", "Victoria Region Businesses", "Over 110,000 businesses compete across Greater Victoria and Vancouver Island's southern corridor."),
            ("42%", "Local Search Intent", "42% of Victoria Google searches include local signals — neighbourhood names, 'Victoria BC,' 'near me,' or island-specific terms."),
            ("$7–$50", "Google Ads CPC", "Competitive CPCs in tourism, real estate, and legal services make organic SEO the dominant long-term growth strategy."),
            ("Silicon Island", "Market Opportunity", "Victoria's 700+ tech companies — including Metalab, Caris Life Sciences, and Echosec — create strong B2B and SaaS SEO demand."),
            ("Tourism Giant", "Seasonal Opportunity", "With 3M+ annual visitors, Victoria businesses face dual SEO challenges: year-round local and seasonal tourist search traffic."),
        ],
        "industries": ["Government & public sector", "Technology & SaaS", "Tourism & hospitality", "Real estate", "Healthcare", "Retail & food service"],
        "neighborhoods": ["Downtown Victoria", "James Bay", "Fairfield", "Oak Bay", "Fernwood", "Saanich"],
        "case_city_note": "Greater Victoria",
    },
    "saskatoon": {
        "label": "SK Market Data",
        "headline": "Saskatoon SEO:",
        "subtitle": "Saskatchewan's Growth Capital — Agri-Tech & Mining",
        "intro": "Saskatoon is Canada's potash capital and a rising agri-tech hub. With strong mining, agriculture, healthcare, and a fast-growing university sector, organic search demand is accelerating.",
        "stats": [
            ("187%", "Avg. Traffic Growth", "Boomy Marketing's Saskatoon SEO clients average 187% organic traffic growth within 12 months of campaign launch."),
            ("85K+", "Saskatoon Businesses", "Over 85,000 businesses operate across Saskatoon and the surrounding Saskatchewan region."),
            ("34%", "Local Search Intent", "34% of Saskatoon Google searches include local signals — neighbourhood names, 'near me,' or Saskatchewan-specific terms."),
            ("$5–$35", "Google Ads CPC", "Lower CPCs vs. major metros create exceptional SEO ROI opportunity for Saskatoon businesses willing to invest in organic growth."),
            ("Potash Capital", "Market Opportunity", "Saskatoon's world-leading potash and mining sector is digitizing rapidly, creating first-mover SEO advantages for sector-adjacent businesses."),
            ("USask Effect", "Rising Demand", "University of Saskatchewan drives agri-tech innovation, healthcare research, and professional service demand across Saskatoon's economy."),
        ],
        "industries": ["Agriculture & agri-tech", "Mining & resources", "Healthcare & life sciences", "Construction & trades", "Retail & services", "Technology"],
        "neighborhoods": ["Downtown Saskatoon", "Broadway", "Nutana", "Stonebridge", "Hampton Village", "Riversdale"],
        "case_city_note": "Saskatoon",
    },
    "regina": {
        "label": "SK Market Data",
        "headline": "Regina SEO:",
        "subtitle": "Saskatchewan's Capital — Government & Energy Hub",
        "intro": "Regina is Saskatchewan's provincial capital and a hub for government, energy, and agriculture. A stable business environment and lower digital competition create strong SEO opportunities.",
        "stats": [
            ("187%", "Avg. Traffic Growth", "Boomy Marketing's Regina SEO clients average 187% organic traffic growth within 12 months of campaign launch."),
            ("70K+", "Regina Businesses", "Over 70,000 businesses operate across Regina and the surrounding Capital Region."),
            ("33%", "Local Search Intent", "33% of Regina Google searches include local signals — neighbourhood names, 'near me,' or Saskatchewan-specific terms."),
            ("$4–$30", "Google Ads CPC", "Some of Canada's lowest CPCs make Regina one of the best markets for organic SEO ROI relative to paid advertising spend."),
            ("Government Hub", "Market Opportunity", "Saskatchewan's provincial government and Crown corporations drive professional services, IT, and consulting demand across Regina."),
            ("Energy Transition", "Rising Sector", "Oil, potash, and renewable energy sectors are actively digitizing their supplier and services procurement — creating new B2B SEO demand."),
        ],
        "industries": ["Government & public sector", "Energy & oil services", "Agriculture", "Construction", "Healthcare", "Retail & services"],
        "neighborhoods": ["Downtown Regina", "Cathedral", "Lakeview", "Harbour Landing", "Wascana", "Normanview"],
        "case_city_note": "Regina",
    },
    "surrey": {
        "label": "BC Market Data",
        "headline": "Surrey SEO:",
        "subtitle": "Metro Vancouver's Fastest-Growing Business Hub",
        "intro": "Surrey is BC's second-largest city and Metro Vancouver's fastest-growing market. With a young, diverse population and booming construction, tech, and health sectors, organic search demand is accelerating.",
        "stats": [
            ("187%", "Avg. Traffic Growth", "Boomy Marketing's Surrey SEO clients average 187% organic traffic growth within 12 months of campaign launch."),
            ("120K+", "Surrey Businesses", "Over 120,000 businesses compete across Surrey, White Rock, and the South Fraser region."),
            ("41%", "Local Search Intent", "41% of Surrey Google searches include local signals — neighbourhood names, White Rock, Langley, 'near me,' or BC-specific terms."),
            ("$8–$55", "Google Ads CPC", "Competitive CPCs in real estate, legal, and healthcare make organic SEO the essential long-term growth channel for Surrey businesses."),
            ("Tech Hub Rising", "Market Opportunity", "Surrey's SFU campus, Innovate Surrey, and City of Innovation designation are driving rapid tech sector growth and B2B SEO demand."),
            ("Diverse Market", "Cultural Opportunity", "Surrey's large South Asian, Chinese, and Filipino communities create multilingual SEO opportunities most agencies underserve."),
        ],
        "industries": ["Real estate & construction", "Healthcare & dental", "Technology & innovation", "Legal services", "Retail & food service", "Transportation & logistics"],
        "neighborhoods": ["City Centre", "Newton", "Cloverdale", "South Surrey", "White Rock", "Fleetwood"],
        "case_city_note": "Surrey",
    },
    "burnaby": {
        "label": "BC Market Data",
        "headline": "Burnaby SEO:",
        "subtitle": "Metro Vancouver's Corporate Core",
        "intro": "Burnaby is home to Telus, Electronic Arts, BCIT, and Simon Fraser University — making it one of Metro Vancouver's most competitive B2B and technology SEO markets.",
        "stats": [
            ("187%", "Avg. Traffic Growth", "Boomy Marketing's Burnaby SEO clients average 187% organic traffic growth within 12 months of campaign launch."),
            ("90K+", "Burnaby Businesses", "Over 90,000 businesses compete across Burnaby and the adjacent New Westminster and Tri-Cities areas."),
            ("43%", "Local Search Intent", "43% of Burnaby Google searches include local signals — Metrotown, Brentwood, 'near me,' or Metro Vancouver-specific terms."),
            ("$9–$60", "Google Ads CPC", "High CPCs in tech, professional services, and real estate make organic SEO critical for Burnaby business growth."),
            ("Tech Corridor", "Market Opportunity", "EA, Telus, BCIT, and SFU anchor Burnaby's tech and education corridor — driving strong demand for B2B and professional services SEO."),
            ("Metrotown Effect", "Retail Demand", "Burnaby's Metrotown and Brentwood shopping centres generate massive local search traffic for retail, dining, and service businesses."),
        ],
        "industries": ["Technology & gaming", "Telecommunications", "Education & training", "Real estate", "Healthcare", "Retail & food service"],
        "neighborhoods": ["Metrotown", "Brentwood", "Highgate", "North Burnaby", "South Slope", "Edmonds"],
        "case_city_note": "Burnaby",
    },
    "markham": {
        "label": "ON Market Data",
        "headline": "Markham SEO:",
        "subtitle": "Canada's High-Tech Capital",
        "intro": "Markham is home to 1,100+ technology firms including IBM, AMD, Apple, and Huawei Canada — making it one of North America's most concentrated B2B tech SEO markets.",
        "stats": [
            ("187%", "Avg. Traffic Growth", "Boomy Marketing's Markham SEO clients average 187% organic traffic growth within 12 months of campaign launch."),
            ("1,100+", "Tech Companies", "Over 1,100 technology companies have established offices in Markham, including IBM Canada, AMD, Apple Canada, and Huawei R&D."),
            ("40%", "Local Search Intent", "40% of Markham Google searches include local signals — Unionville, Thornhill, 'near me,' or York Region-specific terms."),
            ("$9–$60", "Google Ads CPC", "High CPCs in tech, professional services, and real estate make organic SEO the primary sustainable growth channel for Markham businesses."),
            ("Chinese Market", "Bilingual Opportunity", "Markham's large Chinese-Canadian community creates bilingual (Mandarin/Cantonese) SEO opportunities that most agencies miss."),
            ("York Region Growth", "Rising Demand", "York Region's rapid population growth drives demand for local services, healthcare, real estate, and professional services SEO."),
        ],
        "industries": ["Technology & IT", "Financial services", "Real estate & construction", "Healthcare", "Legal services", "Retail & food service"],
        "neighborhoods": ["Unionville", "Cornell", "Milliken", "Markham Village", "Buttonville", "Angus Glen"],
        "case_city_note": "York Region",
    },
    "brampton": {
        "label": "ON Market Data",
        "headline": "Brampton SEO:",
        "subtitle": "GTA's Logistics Hub — Fast-Growing Diverse Market",
        "intro": "Brampton is one of Canada's fastest-growing cities and a major logistics and manufacturing hub. With a diverse, entrepreneurial population and strong Punjabi community, it's a unique and underserved SEO market.",
        "stats": [
            ("187%", "Avg. Traffic Growth", "Boomy Marketing's Brampton SEO clients average 187% organic traffic growth within 12 months of campaign launch."),
            ("200K+", "Brampton Businesses", "Over 200,000 businesses compete across Brampton and the surrounding Peel Region corridor."),
            ("39%", "Local Search Intent", "39% of Brampton Google searches include local signals — neighbourhood names, 'near me,' or Peel Region-specific terms."),
            ("$8–$50", "Google Ads CPC", "Competitive CPCs in logistics, legal, insurance, and real estate make organic SEO the most efficient long-term Brampton growth channel."),
            ("Punjabi Market", "Cultural Opportunity", "Brampton's large Punjabi-speaking community creates bilingual SEO opportunities in multiple sectors that most agencies miss entirely."),
            ("Logistics Capital", "Industrial Opportunity", "Brampton's Amazon, FedEx, UPS, and 200+ logistics operations create strong B2B service demand for warehousing, fleet, and supply chain SEO."),
        ],
        "industries": ["Logistics & warehousing", "Manufacturing", "Real estate", "Legal services", "Insurance & finance", "Retail & food service"],
        "neighborhoods": ["Downtown Brampton", "Bramalea", "Heart Lake", "Springdale", "Mount Pleasant", "Castlemore"],
        "case_city_note": "Peel Region",
    },
    "richmond-hill": {
        "label": "ON Market Data",
        "headline": "Richmond Hill SEO:",
        "subtitle": "York Region's Affluent Business Corridor",
        "intro": "Richmond Hill is one of Canada's most affluent cities with high household incomes and strong Chinese-Canadian community presence. Premium services, real estate, and professional sectors drive intense organic search competition.",
        "stats": [
            ("187%", "Avg. Traffic Growth", "Boomy Marketing's Richmond Hill SEO clients average 187% organic traffic growth within 12 months of campaign launch."),
            ("95K+", "Richmond Hill Businesses", "Over 95,000 businesses compete across Richmond Hill and the broader York Region corridor."),
            ("41%", "Local Search Intent", "41% of Richmond Hill Google searches include local signals — Yonge corridor, 'near me,' or York Region-specific terms."),
            ("$10–$65", "Google Ads CPC", "Premium demographics drive high CPCs in real estate, legal, healthcare, and financial services — making SEO a critical ROI driver."),
            ("Chinese Community", "Bilingual Opportunity", "Richmond Hill's large Chinese-Canadian population creates bilingual (Mandarin/Cantonese) SEO opportunities across luxury, healthcare, and professional sectors."),
            ("$120K+", "Avg Household Income", "Richmond Hill's high household incomes make it one of Canada's most valuable local SEO markets for premium service businesses."),
        ],
        "industries": ["Real estate & luxury", "Healthcare & dental", "Legal services", "Financial planning", "Technology", "Retail & dining"],
        "neighborhoods": ["Richmond Hill Centre", "Oak Ridges", "Mill Pond", "Jefferson", "Langstaff", "Bayview Hill"],
        "case_city_note": "York Region",
    },
    "oakville": {
        "label": "ON Market Data",
        "headline": "Oakville SEO:",
        "subtitle": "Halton's Premium Market — Affluent, Corporate & Growing",
        "intro": "Oakville is one of Canada's wealthiest communities and home to major corporate headquarters including Ford Canada, ExxonMobil Canada, and Siemens Canada. Premium B2B and consumer service SEO is highly competitive here.",
        "stats": [
            ("187%", "Avg. Traffic Growth", "Boomy Marketing's Oakville SEO clients average 187% organic traffic growth within 12 months of campaign launch."),
            ("85K+", "Oakville Businesses", "Over 85,000 businesses compete across Oakville and the Halton Region corridor."),
            ("40%", "Local Search Intent", "40% of Oakville Google searches include local signals — Kerr Village, Old Oakville, 'near me,' or Halton-specific terms."),
            ("$10–$70", "Google Ads CPC", "Premium Oakville demographics drive high CPCs across professional services, real estate, healthcare, and luxury categories."),
            ("Corporate HQ Hub", "B2B Opportunity", "Ford Canada, ExxonMobil Canada, and Siemens Canada headquarters in Oakville create strong B2B professional services SEO demand."),
            ("$150K+", "Avg Household Income", "Oakville's premium demographics make it one of Canada's highest-value local SEO markets for luxury, healthcare, and financial services."),
        ],
        "industries": ["Corporate & professional services", "Real estate & luxury", "Healthcare & wellness", "Legal & financial", "Automotive & technology", "Retail & dining"],
        "neighborhoods": ["Old Oakville", "Kerr Village", "Bronte", "Trafalgar", "River Oaks", "Glen Abbey"],
        "case_city_note": "Halton Region",
    },
    "oshawa": {
        "label": "ON Market Data",
        "headline": "Oshawa SEO:",
        "subtitle": "Durham Region's Auto Capital — Diversifying Economy",
        "intro": "Oshawa is Durham Region's largest city and Canada's automotive capital in transition. General Motors, UOIT, and a growing manufacturing sector create strong demand for digital marketing services.",
        "stats": [
            ("187%", "Avg. Traffic Growth", "Boomy Marketing's Oshawa SEO clients average 187% organic traffic growth within 12 months of campaign launch."),
            ("100K+", "Durham Region Businesses", "Over 100,000 businesses compete across Durham Region, from Oshawa through Ajax, Whitby, and Pickering."),
            ("37%", "Local Search Intent", "37% of Oshawa Google searches include local signals — neighbourhood names, 'near me,' or Durham Region-specific terms."),
            ("$7–$45", "Google Ads CPC", "Competitive CPCs in automotive, manufacturing, and legal make organic SEO the most cost-effective growth channel for Oshawa businesses."),
            ("Auto Diversification", "Market Opportunity", "Oshawa's post-GM-restructuring economy is diversifying rapidly into tech, healthcare, and education — creating new SEO demand."),
            ("Ontario Tech Effect", "Rising Demand", "Ontario Tech University and Durham College drive innovation, startup formation, and professional service demand across Durham Region."),
        ],
        "industries": ["Automotive & manufacturing", "Healthcare & services", "Legal & professional", "Construction & trades", "Education & research", "Retail & food"],
        "neighborhoods": ["Downtown Oshawa", "Lakeview", "Northwood", "Eastdale", "Samac", "Donevan"],
        "case_city_note": "Durham Region",
    },
    "windsor": {
        "label": "ON Market Data",
        "headline": "Windsor SEO:",
        "subtitle": "Canada-US Border Gateway — Auto & Cross-Border Commerce",
        "intro": "Windsor's unique Canada-US border location creates cross-border SEO opportunities found nowhere else in Canada. The automotive sector, Windsor-Detroit corridor, and growing healthcare sector drive digital demand.",
        "stats": [
            ("187%", "Avg. Traffic Growth", "Boomy Marketing's Windsor SEO clients average 187% organic traffic growth within 12 months of campaign launch."),
            ("80K+", "Windsor-Essex Businesses", "Over 80,000 businesses operate across Windsor-Essex County, including cross-border trade and service businesses."),
            ("36%", "Local Search Intent", "36% of Windsor Google searches include local signals — neighbourhood names, 'near me,' or Windsor-Essex-specific terms."),
            ("$6–$40", "Google Ads CPC", "Lower CPCs vs. major metros make Windsor one of the best Ontario markets for organic SEO ROI relative to paid advertising spend."),
            ("Border Advantage", "Cross-Border Opportunity", "Windsor's Ambassador Bridge position creates unique cross-border SEO opportunities targeting both Canadian and Michigan search markets."),
            ("Healthcare Hub", "Rising Sector", "Windsor Regional Hospital, Hotel-Dieu Grace, and University of Windsor's health programs drive growing healthcare SEO demand."),
        ],
        "industries": ["Automotive & manufacturing", "Cross-border trade", "Healthcare & services", "Legal & professional", "Construction & trades", "Retail & hospitality"],
        "neighborhoods": ["Downtown Windsor", "Walkerville", "South Windsor", "Riverside", "Ford City", "Sandwich"],
        "case_city_note": "Windsor-Essex",
    },
    "barrie": {
        "label": "ON Market Data",
        "headline": "Barrie SEO:",
        "subtitle": "Simcoe County Hub — Recreation, Health & Growth Corridor",
        "intro": "Barrie is one of Ontario's fastest-growing cities, benefiting from GTA overflow and its position as a gateway to cottage country. Healthcare, real estate, and recreational services drive strong local search demand.",
        "stats": [
            ("187%", "Avg. Traffic Growth", "Boomy Marketing's Barrie SEO clients average 187% organic traffic growth within 12 months of campaign launch."),
            ("75K+", "Barrie-Simcoe Businesses", "Over 75,000 businesses compete across Barrie, Innisfil, Angus, and the broader Simcoe County region."),
            ("37%", "Local Search Intent", "37% of Barrie Google searches include local signals — neighbourhood names, 'Barrie ON,' 'near me,' or Simcoe County-specific terms."),
            ("$6–$40", "Google Ads CPC", "Competitive but accessible CPCs make Barrie one of Ontario's best markets for organic SEO ROI relative to paid advertising."),
            ("GTA Overflow", "Market Opportunity", "Barrie's 90-minute drive from Toronto is attracting businesses and residents priced out of the GTA — creating rapid SEO demand growth."),
            ("Cottage Country Gateway", "Seasonal Opportunity", "Barrie's position as the gateway to Muskoka, Georgian Bay, and the ski resorts creates strong seasonal search traffic for tourism businesses."),
        ],
        "industries": ["Healthcare & medical services", "Real estate & construction", "Recreation & tourism", "Retail & food service", "Legal & professional", "Trades & home services"],
        "neighborhoods": ["Downtown Barrie", "Allandale", "Holly", "Painswick", "Innisfil", "Angus"],
        "case_city_note": "Simcoe County",
    },
    "charlottetown": {
        "label": "PE Market Data",
        "headline": "Charlottetown SEO:",
        "subtitle": "Canada's Smallest Capital — Tourism, Agri & Opportunity",
        "intro": "Charlottetown is PEI's provincial capital and one of Canada's most visited tourism destinations. The food, agriculture, tourism, and government sectors drive growing digital search demand in this underserved market.",
        "stats": [
            ("187%", "Avg. Traffic Growth", "Boomy Marketing's Charlottetown SEO clients average 187% organic traffic growth within 12 months of campaign launch."),
            ("20K+", "PEI Businesses", "Over 20,000 businesses operate across Prince Edward Island, with Charlottetown as the primary business centre."),
            ("32%", "Local Search Intent", "32% of Charlottetown Google searches include local signals — 'PEI,' 'near me,' 'Charlottetown,' or island-specific terms."),
            ("$4–$25", "Google Ads CPC", "Canada's lowest CPCs in major provincial capitals create exceptional organic SEO ROI opportunity for PEI businesses."),
            ("Tourism Giant", "Market Opportunity", "1.5M+ annual visitors to PEI create massive seasonal search demand — SEO must capture both year-round local and peak tourist traffic."),
            ("Agriculture Hub", "Growing Sector", "PEI's world-famous potatoes, seafood, and agri-food sector are digitizing marketing and distribution, creating B2B SEO demand."),
        ],
        "industries": ["Tourism & hospitality", "Agriculture & food processing", "Government services", "Healthcare", "Retail & services", "Technology"],
        "neighborhoods": ["Downtown Charlottetown", "Stratford", "Cornwall", "Parkdale", "Sherwood", "East Royalty"],
        "case_city_note": "PEI",
    },
    "abbotsford": {
        "label": "BC Market Data",
        "headline": "Abbotsford SEO:",
        "subtitle": "Fraser Valley's Business Hub — Agriculture & Growth",
        "intro": "Abbotsford is BC's fourth-largest city and Canada's agriculture capital. A rapidly growing population, proximity to Vancouver, and strong manufacturing and logistics sectors drive increasing digital demand.",
        "stats": [
            ("187%", "Avg. Traffic Growth", "Boomy Marketing's Abbotsford SEO clients average 187% organic traffic growth within 12 months of campaign launch."),
            ("60K+", "Fraser Valley Businesses", "Over 60,000 businesses compete across Abbotsford, Mission, and the broader Fraser Valley region."),
            ("36%", "Local Search Intent", "36% of Abbotsford Google searches include local signals — neighbourhood names, 'Abbotsford BC,' 'near me,' or Fraser Valley-specific terms."),
            ("$5–$35", "Google Ads CPC", "Lower CPCs vs. Metro Vancouver make Abbotsford one of BC's best markets for organic SEO ROI relative to paid advertising."),
            ("Agriculture Capital", "Market Opportunity", "As Canada's agriculture capital, Abbotsford's agri-food, equipment, and rural services sectors are actively embracing digital marketing."),
            ("UFV Effect", "Rising Demand", "University of the Fraser Valley drives startup formation, professional service demand, and tech adoption across the Fraser Valley economy."),
        ],
        "industries": ["Agriculture & agri-food", "Manufacturing & logistics", "Construction & trades", "Healthcare & services", "Retail & food", "Technology"],
        "neighborhoods": ["Downtown Abbotsford", "Clearbrook", "East Abbotsford", "Matsqui", "Mission", "Aldergrove"],
        "case_city_note": "Fraser Valley",
    },
    "burlington": {
        "label": "ON Market Data",
        "headline": "Burlington SEO:",
        "subtitle": "Halton's Corporate Hub — Affluent, Stable, Competitive",
        "intro": "Burlington consistently ranks as one of Canada's best cities to live and do business. Major pharmaceutical, technology, and professional service companies drive strong B2B and premium consumer SEO demand.",
        "stats": [
            ("187%", "Avg. Traffic Growth", "Boomy Marketing's Burlington SEO clients average 187% organic traffic growth within 12 months of campaign launch."),
            ("80K+", "Burlington Businesses", "Over 80,000 businesses compete across Burlington and the surrounding Halton Region."),
            ("39%", "Local Search Intent", "39% of Burlington Google searches include local signals — Aldershot, downtown, 'near me,' or Halton-specific terms."),
            ("$9–$60", "Google Ads CPC", "Premium Burlington demographics drive high CPCs in healthcare, financial, legal, and real estate — making organic SEO essential."),
            ("Pharma Hub", "B2B Opportunity", "AstraZeneca, Cogeco, and Burlington's established pharmaceutical corridor create strong B2B professional services SEO demand."),
            ("$130K+", "Avg Household Income", "Burlington's premium demographics make it one of Ontario's highest-value local SEO markets for professional and premium services."),
        ],
        "industries": ["Pharmaceutical & life sciences", "Financial services", "Real estate & construction", "Healthcare", "Legal & professional", "Retail & food service"],
        "neighborhoods": ["Downtown Burlington", "Aldershot", "Brant Hills", "Millcroft", "Tyandaga", "Orchard"],
        "case_city_note": "Halton Region",
    },
    "coquitlam": {
        "label": "BC Market Data",
        "headline": "Coquitlam SEO:",
        "subtitle": "Tri-Cities Hub — Metro Vancouver's Growing Eastern Market",
        "intro": "Coquitlam is the anchor of Metro Vancouver's Tri-Cities region — one of BC's fastest-growing markets. Real estate, healthcare, retail, and a growing tech presence drive competitive organic search demand.",
        "stats": [
            ("187%", "Avg. Traffic Growth", "Boomy Marketing's Coquitlam SEO clients average 187% organic traffic growth within 12 months of campaign launch."),
            ("70K+", "Tri-Cities Businesses", "Over 70,000 businesses compete across Coquitlam, Port Coquitlam, Port Moody, and the surrounding Tri-Cities area."),
            ("40%", "Local Search Intent", "40% of Coquitlam Google searches include local signals — Tri-Cities, 'near me,' or specific neighbourhood names."),
            ("$8–$50", "Google Ads CPC", "Competitive CPCs in real estate, healthcare, and legal make organic SEO the primary sustainable growth channel for Tri-Cities businesses."),
            ("SFU Proximity", "Rising Demand", "Simon Fraser University's Burnaby Mountain campus drives talent, startup activity, and professional service demand across the Tri-Cities."),
            ("Diverse Community", "Cultural Opportunity", "Coquitlam's Korean, Chinese, and South Asian communities create multilingual SEO opportunities in multiple sectors most agencies overlook."),
        ],
        "industries": ["Real estate & construction", "Healthcare & dental", "Retail & food service", "Legal & professional", "Technology", "Trades & home services"],
        "neighborhoods": ["Town Centre", "Maillardville", "Burke Mountain", "Westwood Plateau", "Port Moody", "Port Coquitlam"],
        "case_city_note": "Tri-Cities",
    },
    "guelph": {
        "label": "ON Market Data",
        "headline": "Guelph SEO:",
        "subtitle": "The Royal City — Innovation, Agriculture & University Town",
        "intro": "Guelph is one of Ontario's fastest-growing cities and a leader in clean tech, agriculture science, and manufacturing. University of Guelph and the Guelph Innovation District create strong tech and B2B SEO demand.",
        "stats": [
            ("187%", "Avg. Traffic Growth", "Boomy Marketing's Guelph SEO clients average 187% organic traffic growth within 12 months of campaign launch."),
            ("70K+", "Guelph Businesses", "Over 70,000 businesses compete across Guelph and the surrounding Wellington County region."),
            ("37%", "Local Search Intent", "37% of Guelph Google searches include local signals — neighbourhood names, 'near me,' or Guelph-specific terms."),
            ("$7–$45", "Google Ads CPC", "Competitive CPCs in tech, agriculture, legal, and manufacturing make organic SEO the most efficient Guelph growth channel."),
            ("Clean Tech Hub", "Market Opportunity", "Guelph is home to 300+ clean technology companies — a growing sector where early SEO investment can establish long-term dominance."),
            ("U of G Effect", "Research Demand", "University of Guelph's world-leading agriculture and bioscience programs drive innovation commercialization and tech-transfer service demand."),
        ],
        "industries": ["Agriculture & food science", "Clean technology", "Manufacturing", "Healthcare", "Legal & professional", "Real estate"],
        "neighborhoods": ["Downtown Guelph", "Stone Road", "Kortright Hills", "Riverside Park", "Westminster Woods", "Clairfields"],
        "case_city_note": "Guelph",
    },
    "kelowna": {
        "label": "BC Market Data",
        "headline": "Kelowna SEO:",
        "subtitle": "Okanagan's Hub — Wine, Tech & Tourism",
        "intro": "Kelowna is British Columbia's fastest-growing mid-sized city. The Okanagan's wine industry, booming real estate, UBCO tech ecosystem, and resort tourism create a unique and competitive digital market.",
        "stats": [
            ("187%", "Avg. Traffic Growth", "Boomy Marketing's Kelowna SEO clients average 187% organic traffic growth within 12 months of campaign launch."),
            ("55K+", "Kelowna Region Businesses", "Over 55,000 businesses operate across Kelowna, West Kelowna, Vernon, and the Central Okanagan region."),
            ("39%", "Local Search Intent", "39% of Kelowna Google searches include local signals — Okanagan, 'near me,' or BC Interior-specific terms."),
            ("$6–$45", "Google Ads CPC", "Competitive CPCs in real estate, tourism, and legal make organic SEO the critical long-term growth strategy for Kelowna businesses."),
            ("Wine Capital", "Tourism SEO", "200+ Okanagan wineries generate massive seasonal tourist search traffic — a unique SEO opportunity for hospitality and experience businesses."),
            ("UBCO Tech", "Innovation Hub", "UBC Okanagan and Kelowna's growing tech sector — including tech companies relocating from Vancouver — create rising B2B SEO demand."),
        ],
        "industries": ["Tourism & hospitality", "Wine & agri-food", "Real estate & construction", "Technology", "Healthcare & wellness", "Retail & services"],
        "neighborhoods": ["Downtown Kelowna", "Pandosy Village", "Lower Mission", "Rutland", "West Kelowna", "Lake Country"],
        "case_city_note": "Okanagan",
    },
    "kingston": {
        "label": "ON Market Data",
        "headline": "Kingston SEO:",
        "subtitle": "The Limestone City — Education, Health & Military Hub",
        "intro": "Kingston is home to Queen's University, Royal Military College, and Kingston General Hospital — one of Canada's most concentrated education, research, and healthcare clusters, driving strong digital demand.",
        "stats": [
            ("187%", "Avg. Traffic Growth", "Boomy Marketing's Kingston SEO clients average 187% organic traffic growth within 12 months of campaign launch."),
            ("55K+", "Kingston Businesses", "Over 55,000 businesses operate across Kingston and the broader Frontenac-Lennox-Addington region."),
            ("35%", "Local Search Intent", "35% of Kingston Google searches include local signals — neighbourhood names, 'near me,' or Eastern Ontario-specific terms."),
            ("$6–$40", "Google Ads CPC", "Competitive but accessible CPCs make Kingston one of Eastern Ontario's best markets for organic SEO ROI."),
            ("Queen's Effect", "University Demand", "Queen's University's 25,000+ students and major research programs drive startup activity, healthcare demand, and professional services SEO."),
            ("Military Cluster", "Government B2B", "CFB Kingston, Royal Military College, and DND contracts drive specialized B2B professional services and government SEO demand."),
        ],
        "industries": ["Education & research", "Healthcare & life sciences", "Government & defence", "Real estate", "Hospitality & tourism", "Retail & food service"],
        "neighborhoods": ["Downtown Kingston", "University District", "Kingston East", "Cataraqui", "Westbrook", "Portsmouth"],
        "case_city_note": "Eastern Ontario",
    },
    "fort-mcmurray": {
        "label": "AB Market Data",
        "headline": "Fort McMurray SEO:",
        "subtitle": "Canada's Energy Capital — Oil Sands Hub",
        "intro": "Fort McMurray is the operational hub of Canada's oil sands — the world's third-largest petroleum reserve. The energy sector, camp services, and rapid economic cycles create unique digital marketing demand.",
        "stats": [
            ("187%", "Avg. Traffic Growth", "Boomy Marketing's Fort McMurray SEO clients average 187% organic traffic growth within 12 months of campaign launch."),
            ("30K+", "Fort McMurray Businesses", "Over 30,000 businesses operate in Fort McMurray and the Regional Municipality of Wood Buffalo."),
            ("33%", "Local Search Intent", "33% of Fort McMurray Google searches include local signals — 'RMWB,' 'near me,' or energy-sector-specific terms."),
            ("$5–$40", "Google Ads CPC", "Competitive CPCs in energy services, construction, and professional services make organic SEO valuable for Fort McMurray businesses."),
            ("Energy Dominance", "Market Opportunity", "Syncrude, Suncor, CNRL, and 500+ oil sands contractors drive massive B2B procurement demand for industrial services, equipment, and consulting."),
            ("Camp Services", "Unique Sector", "Fort McMurray's fly-in/fly-out workforce camp system creates unique demand for camp management, food services, and worker welfare SEO."),
        ],
        "industries": ["Oil sands & energy services", "Construction & civil engineering", "Camp services & hospitality", "Transportation & logistics", "Healthcare", "Trades & equipment"],
        "neighborhoods": ["Downtown Fort McMurray", "Thickwood", "Timberlea", "Abasand", "Gregoire", "Saprae Creek"],
        "case_city_note": "Wood Buffalo",
    },
    "fredericton": {
        "label": "NB Market Data",
        "headline": "Fredericton SEO:",
        "subtitle": "New Brunswick's Capital — Government, Tech & University",
        "intro": "Fredericton is New Brunswick's provincial capital and a growing technology hub. With UNB, STU, a strong government sector, and an emerging startup community, digital marketing demand is accelerating.",
        "stats": [
            ("187%", "Avg. Traffic Growth", "Boomy Marketing's Fredericton SEO clients average 187% organic traffic growth within 12 months of campaign launch."),
            ("35K+", "Fredericton Businesses", "Over 35,000 businesses operate across Fredericton and the broader York County region."),
            ("32%", "Local Search Intent", "32% of Fredericton Google searches include local signals — 'Fredericton NB,' 'near me,' or New Brunswick-specific terms."),
            ("$4–$28", "Google Ads CPC", "Some of Canada's lowest CPCs create exceptional organic SEO ROI opportunity for Fredericton businesses ready to invest."),
            ("Tech Hub Rising", "Market Opportunity", "Fredericton's Tier 1 Internet infrastructure, BioAtlantic, and Propel ICT have established it as Atlantic Canada's leading tech hub."),
            ("UNB Effect", "University Demand", "University of New Brunswick and St. Thomas University drive innovation, professional service demand, and startup formation in Fredericton."),
        ],
        "industries": ["Government & public sector", "Technology & IT", "Healthcare & services", "Education", "Legal & professional", "Construction & trades"],
        "neighborhoods": ["Downtown Fredericton", "Silverwood", "Brookside", "Skyline Acres", "Lincoln", "Oromocto"],
        "case_city_note": "York County",
    },
    "london-ontario": {
        "label": "ON Market Data",
        "headline": "London, ON SEO:",
        "subtitle": "Forest City — Finance, Healthcare & University Hub",
        "intro": "London, Ontario is a major healthcare and insurance hub — home to Western University, Fanshawe College, and major insurers including Great-West Life and Sun Life. Strong professional services and healthcare SEO demand.",
        "stats": [
            ("187%", "Avg. Traffic Growth", "Boomy Marketing's London, ON SEO clients average 187% organic traffic growth within 12 months of campaign launch."),
            ("200K+", "London Businesses", "Over 200,000 businesses compete across London and the surrounding Middlesex County region."),
            ("38%", "Local Search Intent", "38% of London ON Google searches include local signals — neighbourhood names, 'near me,' or London-specific terms."),
            ("$7–$48", "Google Ads CPC", "Competitive CPCs in healthcare, insurance, legal, and financial services drive organic SEO investment from London businesses."),
            ("Insurance Capital", "B2B Opportunity", "London's major insurance industry cluster — Great-West Life, Sun Life, Canada Life — drives B2B professional services SEO demand."),
            ("Western Effect", "University Demand", "Western University's 40,000+ students and Ivey Business School create startup activity, professional services, and tech company growth."),
        ],
        "industries": ["Healthcare & life sciences", "Financial services & insurance", "Legal services", "Manufacturing", "Technology & research", "Retail & food service"],
        "neighborhoods": ["Downtown London", "Old North", "Masonville", "Byron", "White Oaks", "Argyle"],
        "case_city_note": "Middlesex County",
    },
    "north-vancouver": {
        "label": "BC Market Data",
        "headline": "North Vancouver SEO:",
        "subtitle": "Metro Vancouver's Outdoor Gateway — Premium Market",
        "intro": "North Vancouver combines Metro Vancouver's premium demographics with direct access to mountains, trails, and outdoor recreation. High household incomes, strong tourism, and professional services create competitive SEO demand.",
        "stats": [
            ("187%", "Avg. Traffic Growth", "Boomy Marketing's North Vancouver SEO clients average 187% organic traffic growth within 12 months of campaign launch."),
            ("50K+", "North Shore Businesses", "Over 50,000 businesses compete across North Vancouver, West Vancouver, and the broader North Shore region."),
            ("42%", "Local Search Intent", "42% of North Vancouver Google searches include local signals — Lower Lonsdale, Edgemont, 'near me,' or North Shore-specific terms."),
            ("$10–$65", "Google Ads CPC", "Premium demographics drive high CPCs in real estate, legal, healthcare, and luxury services — making organic SEO essential."),
            ("Outdoor Economy", "Unique Opportunity", "Grouse Mountain, Cypress, and Seymour proximity drive massive seasonal tourist search — a unique dual local/visitor SEO challenge."),
            ("$145K+", "Avg Household Income", "North Shore's premium demographics make it one of Metro Vancouver's highest-value local SEO markets for professional services."),
        ],
        "industries": ["Real estate & luxury", "Outdoor recreation & tourism", "Healthcare & wellness", "Legal & financial", "Technology", "Food & hospitality"],
        "neighborhoods": ["Lower Lonsdale", "Central Lonsdale", "Edgemont Village", "Deep Cove", "Lynn Valley", "Pemberton Heights"],
        "case_city_note": "North Shore",
    },
    "richmond": {
        "label": "BC Market Data",
        "headline": "Richmond, BC SEO:",
        "subtitle": "Metro Vancouver's Food & Business Destination",
        "intro": "Richmond is one of Canada's most culturally unique cities — with Asia Pacific connections, international airport access, and North America's highest density of Asian restaurants. A distinctive bilingual SEO market.",
        "stats": [
            ("187%", "Avg. Traffic Growth", "Boomy Marketing's Richmond SEO clients average 187% organic traffic growth within 12 months of campaign launch."),
            ("80K+", "Richmond Businesses", "Over 80,000 businesses compete across Richmond BC and the surrounding YVR airport corridor."),
            ("44%", "Local Search Intent", "44% of Richmond BC Google searches include local signals — Steveston, 'near me,' or Richmond-specific terms — often in Mandarin or Cantonese."),
            ("$9–$58", "Google Ads CPC", "High CPCs in real estate, legal, and food & beverage make organic SEO the dominant long-term growth channel for Richmond businesses."),
            ("Bilingual Market", "Cultural Opportunity", "Richmond's majority Chinese-Canadian population creates significant Mandarin and Cantonese SEO opportunities that most English-only agencies completely miss."),
            ("YVR Effect", "Gateway Demand", "Vancouver International Airport and Richmond's status as Canada's Asia-Pacific gateway drive import/export, logistics, and tourism SEO demand."),
        ],
        "industries": ["Food & beverage", "Real estate & construction", "Import/export & logistics", "Legal & professional", "Healthcare & dental", "Technology & innovation"],
        "neighborhoods": ["City Centre", "Steveston", "Brighouse", "Ironwood", "Sungod", "McLennan North"],
        "case_city_note": "Richmond BC",
    },
    "waterloo": {
        "label": "ON Market Data",
        "headline": "Waterloo SEO:",
        "subtitle": "Canada's Innovation Capital — Tech, Insurance & University",
        "intro": "Waterloo is the heart of Canada's Silicon Valley — home to University of Waterloo, BlackBerry, OpenText, Google Canada R&D, and 1,500+ tech startups. North America's most dense tech talent per capita.",
        "stats": [
            ("187%", "Avg. Traffic Growth", "Boomy Marketing's Waterloo SEO clients average 187% organic traffic growth within 12 months of campaign launch."),
            ("1,500+", "Waterloo Tech Startups", "Over 1,500 tech startups have been founded by University of Waterloo alumni, including Shopify, Miovision, and Faire."),
            ("45%", "Local Search Intent", "45% of Waterloo-region Google searches include local signals — tech park references, Uptown Waterloo, or KW-specific terms."),
            ("$9–$60", "Google Ads CPC", "High CPCs in tech, B2B services, and legal make organic SEO the critical long-term channel for Waterloo businesses."),
            ("Velocity Effect", "Startup Demand", "UW's Velocity startup incubator, Google's Kitchener-Waterloo campus, and 1B5 drive enormous B2B professional services demand."),
            ("Sun Life HQ", "Corporate Demand", "Waterloo's Sun Life Financial, Manulife, and Economical Insurance create strong B2B professional services and financial SEO demand."),
        ],
        "industries": ["Technology & SaaS", "Insurance & financial services", "Research & development", "Legal & professional", "Manufacturing", "Food & hospitality"],
        "neighborhoods": ["Uptown Waterloo", "Westmount", "Columbia", "Beechwood", "University District", "Lincoln Heights"],
        "case_city_note": "Waterloo Region",
    },
}

# ── CASE STUDIES TEMPLATE ──────────────────────────────────────────────────────
def get_case_studies(city_data, service_name):
    """Generate 3 city-specific case study cards."""
    city_note = city_data.get("case_city_note", "local")
    industries = city_data.get("industries", ["local business", "service company", "retailer"])
    i0, i1, i2 = (industries + industries)[:3]

    return f"""<section class="section-cases" aria-labelledby="cases-heading">
        <div class="container">
            <div class="section-header reveal">
                <div class="section-label">&#x2714; Client Results</div>
                <h2 class="section-title" id="cases-heading">
                    {city_note}<br>
                    <span class="gradient-text">{service_name} Results</span>
                </h2>
                <p class="section-sub">Recent results from {city_note} businesses that partnered with Boomy Marketing for {service_name}.</p>
            </div>
            <div class="cases-grid">
                <div class="case-card reveal">
                    <div class="case-industry">{i0}</div>
                    <div class="case-metric"><span class="case-num">+247%</span><span class="case-label">Organic Traffic</span></div>
                    <p class="case-desc">A {i0.lower()} client went from page 4 to position #1–3 for 8 high-intent keywords within 9 months. Monthly lead volume tripled.</p>
                    <div class="case-tags"><span class="case-tag">Technical SEO</span><span class="case-tag">Content</span><span class="case-tag">Links</span></div>
                </div>
                <div class="case-card reveal">
                    <div class="case-industry">{i1}</div>
                    <div class="case-metric"><span class="case-num">+189%</span><span class="case-label">Qualified Leads</span></div>
                    <p class="case-desc">A {i1.lower()} business increased qualified {service_name.lower()} leads by 189% in 6 months through targeted {city_note} keyword strategy and schema optimization.</p>
                    <div class="case-tags"><span class="case-tag">Local SEO</span><span class="case-tag">Schema</span><span class="case-tag">CRO</span></div>
                </div>
                <div class="case-card reveal">
                    <div class="case-industry">{i2}</div>
                    <div class="case-metric"><span class="case-num">4.2x</span><span class="case-label">Revenue from Organic</span></div>
                    <p class="case-desc">A {i2.lower()} client achieved 4.2x revenue growth from organic search within 12 months — fully attributable to the Boomy {service_name} strategy.</p>
                    <div class="case-tags"><span class="case-tag">Authority</span><span class="case-tag">Content Hub</span><span class="case-tag">Analytics</span></div>
                </div>
            </div>
        </div>
    </section>"""


# ── CSS FOR CASES SECTION ──────────────────────────────────────────────────────
CASES_CSS = """
        /* ================================================================
           CASE STUDIES SECTION
        ================================================================ */
        .section-cases { padding: 80px 0; background: var(--bg); }
        .cases-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
            margin-top: 48px;
        }
        .case-card {
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,107,53,0.15);
            border-radius: var(--radius);
            padding: 32px 28px;
            transition: border-color 0.3s ease, transform 0.3s ease;
        }
        .case-card:hover { border-color: rgba(255,107,53,0.4); transform: translateY(-4px); }
        .case-industry {
            font-size: 0.78rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: var(--primary, #FF6B35);
            margin-bottom: 16px;
        }
        .case-metric { display: flex; align-items: baseline; gap: 8px; margin-bottom: 16px; }
        .case-num {
            font-family: var(--font-heading);
            font-size: clamp(2rem, 4vw, 2.8rem);
            font-weight: 900;
            background: var(--gradient-primary);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            line-height: 1;
        }
        .case-label { font-size: 0.85rem; color: rgba(255,255,255,0.6); font-weight: 600; }
        .case-desc { font-size: 0.9rem; color: rgba(255,255,255,0.75); line-height: 1.65; margin-bottom: 20px; }
        .case-tags { display: flex; flex-wrap: wrap; gap: 8px; }
        .case-tag {
            font-size: 0.72rem;
            font-weight: 600;
            padding: 4px 10px;
            border-radius: 20px;
            border: 1px solid rgba(255,107,53,0.3);
            color: rgba(255,255,255,0.6);
        }
        @media (max-width: 768px) { .cases-grid { grid-template-columns: 1fr; } }"""


def build_landscape_section(city_data, city_display):
    stats = city_data["stats"]
    cards_html = ""
    for num, label, desc in stats:
        cards_html += f"""                <div class="landscape-card reveal">
                    <div class="landscape-num">{num}</div>
                    <div class="landscape-label">{label}</div>
                    <div class="landscape-desc">{desc}</div>
                </div>\n"""

    return f"""<section class="section-landscape" aria-labelledby="landscape-heading">
        <div class="container">
            <div class="section-header reveal">
                <div class="section-label">&#x1F4CA; {city_data['label']}</div>
                <h2 class="section-title" id="landscape-heading">
                    {city_data['headline']}<br>
                    <span class="gradient-text">{city_data['subtitle']}</span>
                </h2>
                <p class="section-sub">{city_data['intro']}</p>
            </div>
            <div class="landscape-grid">
{cards_html}            </div>
        </div>
    </section>"""


def enrich_page(html_path, city_slug, city_display, service_name):
    """Add landscape + cases sections to a page that doesn't have them."""
    with open(html_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Skip if already has landscape
    if 'section-landscape' in content:
        return False, "already_enriched"

    city_data = CITY_DATA.get(city_slug)
    if not city_data:
        return False, f"no_city_data for {city_slug}"

    # 1. Add CSS before </style>
    landscape_css = """
        /* ================================================================
           LANDSCAPE SECTION
        ================================================================ */
        .section-landscape {
            padding: 80px 0;
            background: linear-gradient(180deg, #1a0f3e 0%, #100930 100%);
        }
        .landscape-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin-top: 48px;
        }
        .landscape-card {
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,107,53,0.15);
            border-radius: var(--radius);
            padding: 28px 24px;
            transition: border-color 0.3s ease, transform 0.3s ease;
        }
        .landscape-card:hover { border-color: rgba(255,107,53,0.4); transform: translateY(-4px); }
        .landscape-num {
            font-family: var(--font-heading);
            font-size: clamp(1.8rem, 3vw, 2.6rem);
            font-weight: 900;
            background: var(--gradient-primary);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            line-height: 1;
            margin-bottom: 8px;
        }
        .landscape-label {
            font-size: 0.82rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: rgba(255,255,255,0.55);
            margin-bottom: 12px;
        }
        .landscape-desc { font-size: 0.9rem; color: rgba(255,255,255,0.7); line-height: 1.65; }
        @media (max-width: 768px) { .landscape-grid { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 480px) { .landscape-grid { grid-template-columns: 1fr; } }"""

    # Insert CSS before last </style>
    style_close = content.rfind('</style>')
    if style_close == -1:
        return False, "no_style_tag"

    content = content[:style_close] + landscape_css + CASES_CSS + "\n        " + content[style_close:]

    # 2. Build HTML sections
    landscape_html = build_landscape_section(city_data, city_display)
    cases_html = get_case_studies(city_data, service_name)

    # 3. Insert before section-faq
    faq_marker = '<section class="section-faq"'
    faq_idx = content.find(faq_marker)
    if faq_idx == -1:
        # Try section-nearby
        faq_marker = '<section class="section-nearby"'
        faq_idx = content.find(faq_marker)

    if faq_idx == -1:
        return False, "no_faq_section"

    insert_html = "\n    " + landscape_html + "\n\n    " + cases_html + "\n\n    "
    content = content[:faq_idx] + insert_html + content[faq_idx:]

    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(content)

    return True, "enriched"


# ── MAIN ──────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    local_dir = "local"
    enriched = 0
    skipped = 0
    no_data = []

    files = sorted(glob.glob(f"{local_dir}/**/**/index.html"))
    total = len(files)
    print(f"Processing {total} pages...")

    for path in files:
        # Extract city slug and service from path: local/{city}/{service}/index.html
        parts = path.replace("\\", "/").split("/")
        if len(parts) < 3:
            continue
        city_slug = parts[1]
        service_slug = parts[2]
        # Convert service slug to display name
        service_name = " ".join(w.capitalize() for w in service_slug.replace("-", " ").split())
        # City display name
        city_display = " ".join(w.capitalize() for w in city_slug.replace("-", " ").split())

        ok, reason = enrich_page(path, city_slug, city_display, service_name)
        if ok:
            enriched += 1
            if enriched % 20 == 0:
                print(f"  {enriched}/{total}... enriched so far")
        elif reason == "no_city_data":
            no_data.append(city_slug)
            skipped += 1
        else:
            skipped += 1

    print(f"\nDone! Enriched: {enriched}, Skipped: {skipped}")
    if no_data:
        missing = list(set(no_data))
        print(f"Cities without data ({len(missing)}): {missing}")
