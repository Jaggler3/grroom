import React from "react";

import './DisplayError.scss'

const DisplayError = ({ errorText }: { errorText: string }) => (errorText !== "") ? <p className="display-error">{errorText}</p> : null

export default DisplayError