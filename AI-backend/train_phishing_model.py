# train_phishing_model.py
"""
Fine-tune DistilBERT for multi-label phishing tactic detection.
"""
import json
import torch
from torch.utils.data import Dataset, DataLoader
from transformers import DistilBertTokenizerFast, DistilBertForSequenceClassification, Trainer, TrainingArguments
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.model_selection import train_test_split

# 1. Load and preprocess data
def load_data(json_path):
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    texts = [item['text'] for item in data]
    labels = [item['labels'] for item in data]
    return texts, labels

class PhishingDataset(Dataset):
    def __init__(self, texts, labels, tokenizer, max_length=256):
        self.encodings = tokenizer(texts, truncation=True, padding=True, max_length=max_length)
        self.labels = labels
    def __getitem__(self, idx):
        item = {key: torch.tensor(val[idx]) for key, val in self.encodings.items()}
        item['labels'] = torch.tensor(self.labels[idx], dtype=torch.float)
        return item
    def __len__(self):
        return len(self.labels)

if __name__ == "__main__":
    # Path to your labeled data
    DATA_PATH = "phishing_labeled.json"  # Place your labeled data here
    MODEL_OUT = "phishing_tactics_model"

    texts, raw_labels = load_data(DATA_PATH)
    mlb = MultiLabelBinarizer()
    labels = mlb.fit_transform(raw_labels)
    label_names = mlb.classes_.tolist()
    with open(f"{MODEL_OUT}/label_names.json", "w") as f:
        json.dump(label_names, f)

    tokenizer = DistilBertTokenizerFast.from_pretrained('distilbert-base-uncased')
    X_train, X_val, y_train, y_val = train_test_split(texts, labels, test_size=0.1, random_state=42)
    train_dataset = PhishingDataset(X_train, y_train, tokenizer)
    val_dataset = PhishingDataset(X_val, y_val, tokenizer)

    model = DistilBertForSequenceClassification.from_pretrained(
        'distilbert-base-uncased',
        num_labels=len(label_names),
        problem_type="multi_label_classification"
    )

    training_args = TrainingArguments(
        output_dir=MODEL_OUT,
        num_train_epochs=3,
        per_device_train_batch_size=8,
        per_device_eval_batch_size=8,
        logging_dir=f"{MODEL_OUT}/logs",
        logging_steps=10,
    )

    def compute_metrics(eval_pred):
        logits, labels = eval_pred
        preds = (torch.sigmoid(torch.tensor(logits)) > 0.5).int().numpy()
        labels = labels.astype(int)
        accuracy = (preds == labels).mean()
        return {"accuracy": accuracy}

    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        eval_dataset=val_dataset,
        compute_metrics=compute_metrics,
    )
    trainer.train()
    trainer.save_model(MODEL_OUT)
    print(f"Model and label names saved to {MODEL_OUT}/")
