import pandas as pd
import json
import re

# Define keyword-to-tactic mapping
TACTIC_KEYWORDS = [
    ("Urgency", [r"urgent|immediately|now|act fast|limited time|expire|today only|asap|hurry|final notice|last chance"]),
    ("Reward", [r"win|winner|prize|reward|free|gift|congratulations|claim|selected|pre-approved|offer|trial|vacation|upgrade|bonus|cash|credit|loan|discount|voucher|coupon|jackpot"]),
    ("Link Manipulation", [r"click here|http|www|link|visit|access|login|sign in|open|tap|url|web|website|track|unsubscribe"]),
    ("Authority", [r"admin|administrator|support|customer service|bank|account|security|team|official|government|irs|paypal|amazon|apple|microsoft|it department|ceo|manager|officer|service provider"]),
    ("Impersonation", [r"pretend|posing as|impersonat|fake|fraud|phishing|scam|not really|not actually|posing|masquerad|identity theft"]),
    ("Information Request", [r"provide|send|reply with|share|confirm|verify|update|fill|complete|details|info|information|password|pin|ssn|social security|bank details|account number|credentials|login|address|phone|payment|billing|card|deposit|number|security code"]),
]

def assign_tactics(text):
    text = text.lower()
    tactics = set()
    for tactic, patterns in TACTIC_KEYWORDS:
        for pat in patterns:
            if re.search(pat, text):
                tactics.add(tactic)
    # If no tactics found, assign generic 'Reward' for spam, else return found
    return list(tactics) if tactics else ["Reward"]

def main():
    df = pd.read_csv("phishing_tactics_model/spam.csv", encoding="latin1")
    # The dataset has columns: v1 (label), v2 (text)
    data = []
    for _, row in df.iterrows():
        label = row['v1']
        text = str(row['v2'])
        if label == 'ham':
            data.append({"text": text, "labels": ["Ham"]})
        elif label == 'spam':
            tactics = assign_tactics(text)
            data.append({"text": text, "labels": tactics})
    with open("phishing_labeled.json", "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"Converted {len(data)} messages to phishing_labeled.json with advanced tactic assignment.")

