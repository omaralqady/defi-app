from scripts.deploy import deploy_token_and_token_farm
from brownie import network, exceptions
from scripts.utils import LOCAL_BLOCKCHAIN_ENVIRONMENTS, get_account, get_contract
import pytest


def test_set_price_feed_contract():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local tests")
    account = get_account()
    farm, token = deploy_token_and_token_farm()
    price_feed = get_contract("eth_usd_price_feed")
    farm.setPriceFeedContract(token.address, price_feed, {"from": account})

    assert farm.tokenPriceFeedMapping(token.address) == price_feed


def test_set_price_feed_contract_fails_with_non_owner():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local tests")
    non_owner = get_account(index=1)
    farm, token = deploy_token_and_token_farm()
    price_feed = get_contract("eth_usd_price_feed")

    with pytest.raises(exceptions.VirtualMachineError):
        farm.setPriceFeedContract(token.address, price_feed, {"from": non_owner})
