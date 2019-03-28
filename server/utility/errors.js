export default (errors = {
    invalid_parameters:        [100, 'Invalid Parameters'],
    server_error:              [200, 'Server Error'],
    account_already_exist:     [300, 'Accound Already Exist'],
    user_name_taken:           [400, 'User Name already taken please try another one'],
    password_length:           [400, 'password length should be greater than 8'],
    password_check:            [500, 'password must contain one capital letter,Special charactor and numerical value'],
    account_doesnot_exist:     [700, 'Account Doesnot exists'],
    invalid_tokn:              [800, 'Access with token is not authorised'],
    password_not_match:        [900, 'Password does not match with this account'],
    token_auth_failure:        [1500, 'Failed to authenticate token.']
})
  