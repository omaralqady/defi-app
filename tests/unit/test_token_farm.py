from scripts.deploy import deploy_token_and_token_farm
from brownie import network, exceptions
from scripts.utils import (
    LOCAL_BLOCKCHAIN_ENVIRONMENTS,
    get_account,
    get_contract,
    INIT_PRICE_VALUE,
)
import pytest


def check_network():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local tests")


def test_set_price_feed_contract():
    check_network()
    account = get_account()
    farm, token = deploy_token_and_token_farm()
    price_feed = get_contract("eth_usd_price_feed")
    farm.setPriceFeedContract(token.address, price_feed, {"from": account})

    assert farm.tokenPriceFeedMapping(token.address) == price_feed


def test_set_price_feed_contract_fails_with_non_owner():
    check_network()
    non_owner = get_account(index=1)
    farm, token = deploy_token_and_token_farm()
    price_feed = get_contract("eth_usd_price_feed")

    with pytest.raises(exceptions.VirtualMachineError):
        farm.setPriceFeedContract(token.address, price_feed, {"from": non_owner})


def test_allow_token():
    check_network()
    farm, token = deploy_token_and_token_farm()

    farm.addAllowedToken(token.address)

    assert farm.allowedTokenList(0) == token.address


def test_stake_tokens(amount_staked):
    check_network()
    account = get_account()
    farm, token = deploy_token_and_token_farm()

    token.approve(farm.address, amount_staked, {"from": account})
    farm.addAllowedToken(token.address)

    farm.stakeTokens(amount_staked, token.address, {"from": account})

    assert farm.stakingBalance(token.address, account.address) == amount_staked
    assert farm.stakers(0) == account.address
    assert farm.uniqueTokensStaked(account.address) == 1


def test_get_token_value():
    check_network()
    account = get_account()
    farm, token = deploy_token_and_token_farm()

    price_feed = get_contract("eth_usd_price_feed")
    farm.setPriceFeedContract(token.address, price_feed, {"from": account})

    (price, decimal) = farm.getTokenValue(token.address)

    assert price == INIT_PRICE_VALUE
