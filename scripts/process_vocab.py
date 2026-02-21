import os
import json

def process_hsk_vocab(base_path, output_file):
    vocab_map = {}
    
    # Levels 1 to 6
    for level in range(1, 7):
        filename = f"HSK_Level_{level}_words.txt"
        file_path = os.path.join(base_path, filename)
        if os.path.exists(file_path):
            print(f"Processing Level {level}...")
            with open(file_path, 'r', encoding='utf-8') as f:
                for line in f:
                    word = line.strip()
                    if word:
                        # Handle potential annotations or numbers like '本1' or '点1'
                        # The dataset seems to have these for disambiguation. 
                        # We'll normalize by keeping the core word but allowing the lookup.
                        normalized = word.rstrip('0123456789')
                        vocab_map[normalized] = level
        else:
            print(f"Warning: {file_path} not found.")

    # Level 7-9
    filename_79 = "HSK_Level_7-9_words.txt"
    file_path_79 = os.path.join(base_path, filename_79)
    if os.path.exists(file_path_79):
        print("Processing Level 7-9...")
        with open(file_path_79, 'r', encoding='utf-8') as f:
            for line in f:
                word = line.strip()
                if word:
                    normalized = word.rstrip('0123456789')
                    vocab_map[normalized] = 7 # 7 represents Advanced (7-9)
                    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(vocab_map, f, ensure_ascii=False, indent=2)
    
    print(f"Successfully created {output_file} with {len(vocab_map)} words.")

if __name__ == "__main__":
    hsk_words_dir = "/Users/aphchat/Coding Year 1/VERCEL HACKATHON/Resource/Chinese_Vocab_Grammar/New HSK (2025)/HSK Words"
    output_path = "/Users/aphchat/Coding Year 1/VERCEL HACKATHON/lib/hsk/hsk_vocab_2025.json"
    
    # Ensure directory exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    process_hsk_vocab(hsk_words_dir, output_path)
