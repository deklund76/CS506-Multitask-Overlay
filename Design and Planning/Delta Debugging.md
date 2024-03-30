𝚫 Debugging

cx = {1,2,3,4,5,6,7,8}
Iteration 1, split cx into 2 parts (n =2)

C1 = {1,2,3,4} c2 = {5,6,7,8}

|cx| ≠ 1

test(cx/c1) = X

Cx’ = cx/c1 = {5,6,7,8}

Iteration 2, split cx’ into 2 parts

C1 = {5,6} c2 = {7,8}

test(cx’/c1) = ✔

test(cx’/c2) = X

Cx’ = cx’/c2 = {5,6}

Iteration 3, split cx’ into 2 parts

C1 = {5} c2 = {6}

|cx| ≠ 1

test(cx’/c1) = X

Cx’ = cx’/c1 = {6}

Iteration 4, |cx’| = 1

Return cx’ = {6}

2. Cx = {1,2,3,4,5,6,7,8}
