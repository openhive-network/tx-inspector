1. Positive cases:
Signature specific tests

1.1 Transaction without any signature (open authority) (example: temp account)

1.2 Transaction containing single signature:
1.2.1 ~~Transaction containing single operation~~
1.2.2 ~~Transaction containing multpile operations where reqiuired authorities are satisfied by given signature~~

1.3 Transaction containing multiple signatures
1.3.1 Transaction containing single operation (there are some blockchain operations requiring multiple authorities, i.e recover_account)
1.3.2 ~~Transaction containing multiple operations (each operation requires separate authority)~~

2. Positive cases:
Authority specific tests

2.1 Transaction containing single signature:
2.1.1 ~~Direct authority (directly specified authority public key)~~
2.1.2 ~~Delegated authority (delegated authrotiy to someone else account)~~

2.1.3 Non default weights:
2.1.3.1 ~~Weight 3, threshold 2 for direct authority~~
2.1.3.2 ~~Weight 3, threshold 2 for delegated authority~~

2.2 Transaction containing multiple signatures:
2.2.1 Each signature uses public key specified as delegated authority.

2.2.2 Non default weights:
2.2.2.1 Both signatures use same weights satisfying authority threshold (each of them can satisfy threshold alone)
2.2.2.2 All signatures are required to satisfy authority threshold (the first one has weight 1, the other one has weight 2, threshold is 3)

2.3 Longer authority paths:
2.3.1 Single nest level
2.3.2 Multiple nest level (max. 2 for positive case)

2.4 Signature is valid but decoded public key does not match any known account

3. Mixed authorities

3.1 Using active authority to satisfy posting authority requirement
3.2 Using owner authority to satisfy posting authority requirement
3.3 Using owner authority to satisfy active authority requirement

4. Negative cases:

4.1 Empty transaction (no operations)
4.1.1 No operations and no signatures
4.1.2 No operations but signature and are present

4.2 Invalid expiration time
4.2.1 Expiration time from far future, i.e extending 1 hour expiration time limit and 24 hours signature validity limit (hf28)

4.3 Invalid tapos (ref block id)

4.4 Missing authority
4.4.1 There is no matching signature to transaction sig digest
4.4.2 There is no matching signature for some authority required by operation (Signature is valid but decoded public key does not match any required authority)
4.4.3 Signature is valid but decoded public key points to authority having wrong authotiy level (posting authority used for transaction required active authority)
4.4.4 Signature is valid but in decoded public key points to authority having too less weight according to threshold

4.4.5 Invalid serialization type
4.4.5.1 Transaction is serialized using hf26 mode but signed using legacy mode
4.4.5.2 Transaction is serialized using legacy mode but isgned usign hf26 mode
4.4.5.3 Different chain id used to calculate sig digestS
