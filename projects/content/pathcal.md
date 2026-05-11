---
title: 'PathCal'
date: '2025-10-05'
excerpt: 'A monitor calibration tool for pathologists performing digital sign-out.'
tech: ['Clinical', 'Digital Pathology']
---

## Overview

A monitor calibration tool for pathologists performing digital sign-out.

## Problem

- Digital pathology sign-out requires monitors that accurately render subtle tissue differences, but most labs lack a quick, standardized QC check
- Existing solutions require hardware colorimeters or vendor-specific software installs

## Solution

Two modes: a 1-minute **Quick Check** wizard (4 pass/fail tests with remediation guidance) and an **Advanced Tools** page with DICOM GSDF grayscale ramps, CIEDE2000-calibrated color discrimination patches, Landolt-C sharpness patterns, luminance uniformity fields, and an SMPTE test pattern.

## Details

- 18-step grayscale ramp at uniform CIELAB lightness intervals (TG18-LN approximation)
- Low-contrast detection at 3 ΔE00 and 1 ΔE00 thresholds
- Stain-specific color patches for H&E, DAB, PAS, Trichrome, and other common histological stains
- Printable QC checklist

[Launch Quick Check →](monitor-calibration/index.html)

[Launch Advanced Tools →](monitor-calibration/advanced.html)
