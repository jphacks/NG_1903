import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components'

const StyledIndicator = styled.div`
    text-align: center;
    margin: 32px;
`

const Indicator: React.FC = () => {
    return (
        <StyledIndicator>
            <FontAwesomeIcon icon={faCircleNotch} spin size="6x" />
        </StyledIndicator>
    )
}
export default Indicator