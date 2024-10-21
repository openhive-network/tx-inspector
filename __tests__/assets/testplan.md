## TESTCASE 1

- **Title**: Should be able to retrieve authority path for directly signed transactions.
- **Description**: The authority path should exclusively return the single account associated with the public key used to sign the transaction.

## TESTCASE 2

- **Title**: Should be able to retrieve authority path for delegated signing transactions.
- **Description**: The algorithm should iterate through all accounts to identify nesting levels, ensuring each authority account satisfies transaction requirements by verifying weight and threshold.

## TESTCASE 3

- **Title**: Should be able to get the authority path with more than 2 nestings.
- **Description**: Currently, the blockchain only allows transaction sign delegation up to two levels deep. However, we can utilize mock data to test the algorithm's behavior when dealing with transactions that involve more than two levels of nesting.

## TESTCASE 4

- **Title**: Should be able to get transaction processed transaction when the authority is invalid.
- **Description**: It's essential to determine what information can be retrieved from a transaction when the authority is invalid.

## TESTCASE 5

- **Title**: Should throw an error for unsatisfied transaction signatures.
- **Description**: An error should be triggered if the total weight of the signatures is less than the required threshold.

## TESTCASE 6

- **Title**: Should throw an error for one unsatisfied signature in multi-signature transaction.
- **Description**: An error should be triggered if any authority account's weight is less than the required threshold, even if other authority accounts meet the transaction's requirements.
