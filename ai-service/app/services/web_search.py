import requests

def duckduckgo_search(query: str):
    url = "https://api.duckduckgo.com/"
    params = {
        "q": query,
        "format": "json",
        "no_redirect": 1,
        "no_html": 1,
        "skip_disambig": 1
    }

    response = requests.get(url, params=params, timeout=30)
    response.raise_for_status()
    data = response.json()

    results = []

    abstract = data.get("AbstractText")
    abstract_url = data.get("AbstractURL")
    heading = data.get("Heading")

    if abstract:
        results.append({
            "title": heading or query,
            "url": abstract_url or "",
            "snippet": abstract
        })

    related_topics = data.get("RelatedTopics", [])
    for item in related_topics[:5]:
        if "Text" in item and "FirstURL" in item:
            results.append({
                "title": item.get("Text", "").split(" - ")[0],
                "url": item.get("FirstURL", ""),
                "snippet": item.get("Text", "")
            })
        elif "Topics" in item:
            for sub in item["Topics"][:3]:
                if "Text" in sub and "FirstURL" in sub:
                    results.append({
                        "title": sub.get("Text", "").split(" - ")[0],
                        "url": sub.get("FirstURL", ""),
                        "snippet": sub.get("Text", "")
                    })

    deduped = []
    seen = set()
    for item in results:
        key = item["url"] or item["title"]
        if key not in seen:
            seen.add(key)
            deduped.append(item)

    return deduped[:6]