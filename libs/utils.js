function getObjectLength(oObject)
{
	var nLength = 0,
		sKey = '';
	for (sKey in oObject) {
		if (oObject.hasOwnProperty(sKey)) {
			nLength = nLength + 1;
		}
	}
	return nLength;
}