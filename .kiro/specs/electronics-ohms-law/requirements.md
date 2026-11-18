# Requirements Document

## Introduction
**Feature:** Electronics: verifying Ohm's law (P1)

Series circuit of cells, key, rheostat, ammeter and test wire with a voltmeter across the wire (D6). Analogue meters with ranges; wire heats if the key stays closed.

## Glossary
- **Ohms_Lab**: the D6 lab workspace.
- **Key**: the switch that opens or closes the circuit.
- **Rheostat**: variable resistor used to change the current.

## Requirements

### Requirement 1 — Circuit behaviour
**User Story:** As a student, I want a circuit that behaves like real equipment.
#### Acceptance Criteria
1. THE Ohms_Lab SHALL compute current from EMF, internal resistance, rheostat, ammeter and wire resistance.
2. WHILE the key is closed THE Ohms_Lab SHALL animate current flow and heat the wire, raising its resistance with its temperature coefficient.
3. WHEN the wire temperature rises 7 °C above room temperature THE Ohms_Lab SHALL warn the student to open the key between readings.
4. THE Ohms_Lab SHALL show analogue needle meters with selectable ranges and warn when a reading exceeds full scale.
5. WHEN a reading is recorded THE Ohms_Lab SHALL round it to the selected range's resolution.
6. THE Ohms_Lab SHALL plot V against I live and show the slope as R.
## Correctness properties
- With temperature fixed, V/I equals the wire resistance within instrument tolerance.
- Current never exceeds EMF / (internal resistance + ammeter resistance).
