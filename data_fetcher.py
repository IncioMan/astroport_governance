import pandas as pd
from libraries.astro_data_provider import AstroDataProvider
def claim(claim_hash):
    df = pd.read_json(
            f"https://api.flipsidecrypto.com/api/v2/queries/{claim_hash}/data/latest",
            convert_dates=["BLOCK_TIMESTAMP"])
    df.columns = [c.lower() for c in df.columns]
    return df

data_provider = AstroDataProvider(claim)
data_provider.load()
data_provider.parse()
data_provider.to_file('./data')