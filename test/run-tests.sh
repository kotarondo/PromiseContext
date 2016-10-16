#!/bin/bash
# Copyright (c) 2016, Kotaro Endo.
# license: "BSD-3-Clause"

FAILED=0
SUCCESS=0

for test in test/test*.js
do
echo testing $test
node $test
if [ $? -ne 0 ]; then
	let "FAILED += 1"
else
	let "SUCCESS += 1"
fi
done

echo
echo "FAILED=$FAILED"
echo "SUCCESS=$SUCCESS"
echo

exit $FAILED
