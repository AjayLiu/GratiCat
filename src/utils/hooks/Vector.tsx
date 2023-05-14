import React from "react";
import Constants from "expo-constants";



export default async function categorise_vector(prompt:string){
    const open_api = Constants.manifest?.extra?.openAPIKey;
    console.log(open_api);
    const api_url = "https://api.openai.com/v1/embeddings";
    const model = "text-embedding-ada-002";
    const get_embedding = async () => {
        try{
            const response = await fetch(api_url, {
                headers:{
                    'Authorization': `Bearer ${open_api}`,
                    'Content-Type': 'application/json'
                },
                body : JSON.stringify({
                    'model' : model,
                    'input' : prompt,
                }),
                method: 'POST',
            })
            const data = await response.json();
            return (data.data[0].embedding);
        } catch (error){
            console.log(error);
            return null;
        }
    }
    const data = await get_embedding();
    return data;
}

// calculate the sim of two vectors (not that fast but its fine)
function cosineSimilarity(vectorA: Array<number>, vectorB: Array<number>) {
    const dotProduct = vectorA.reduce((acc, val, index) => acc + val * vectorB[index], 0);
    const normA = Math.sqrt(vectorA.reduce((acc, val) => acc + val * val, 0));
    const normB = Math.sqrt(vectorB.reduce((acc, val) => acc + val * val, 0));
    return dotProduct / (normA * normB);
}

// returns true if the key was sucessfully added, false if the key already exists
export async function add_on_standard_embeddings(standard_embeddings: any, new_word: string){
    if(standard_embeddings.hasOwnProperty(new_word)){
        return false;
    } else {
        const new_embedding = categorise_vector(new_word);
        standard_embeddings[new_word] = new_embedding;
        return true;
    }
}

// will retrieve the closest word from a list of standard embeddings
export function get_closest_category(embedding: Array<number>, standard_embeddings: any){
    let keys = Object.keys(standard_embeddings);
    let closestWord = keys[0];
    let highestSim = -Infinity;
    for(let i = 0; i < keys.length; ++i){
        const similarity = cosineSimilarity(embedding, standard_embeddings[keys[i]]);
        if(similarity > highestSim){
            highestSim = similarity;
            closestWord = keys[i];
        }
    }
    return closestWord;
}

function lower_token_sample(list_of_thanks: Array<string>, constant = 60){
    if(list_of_thanks.length > constant){
        let n = constant;
        let result = new Array(n),
        len = list_of_thanks.length,
        taken = new Array(len);
        while (n--) {
            var x = Math.floor(Math.random() * len);
            result[n] = list_of_thanks[x in taken ? taken[x] : x];
            taken[x] = --len in taken ? taken[len] : len;
        }
        return result;
    } else {
        return list_of_thanks;
    }
}

export async function get_summary(list_of_thanks: Array<string>){
    const open_api = Constants.manifest?.extra?.openAPIKey;
    const api_url = "https://api.openai.com/v1/chat/completions";
    const model = "gpt-3.5-turbo";
    const prompt = "This is a list of things I am thankful for: " 
    + JSON.stringify(lower_token_sample(list_of_thanks)) + ". Summarise this into a short sentence capturing 4-5 key ideas. Refer to me as you.";

    const get_summary = async () => {
        try{
            const response = await fetch(api_url, {
                headers:{
                    'Authorization': `Bearer ${open_api}`,
                    'Content-Type': 'application/json'
                },
                body : JSON.stringify({
                    'model' : model,
                    'messages' : [{'role' : 'user', 'content' : prompt}],
                }),
                method: 'POST',
            })
            const data = await response.json();
            console.log(data.choices[0].message.content);
            return (data.choices[0].message.content);
        } catch (error){
            console.log(error);
            return null;
        }
    }
    const data = await get_summary();
    return data;
}