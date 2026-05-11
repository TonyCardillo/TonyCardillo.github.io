---
title: 'CI Prep Pro'
date: '2025-10-10'
excerpt: 'Question bank for the Clinical Informatics board exam. Practice questions at 1/40th the cost of traditional prep courses.'
tech: ['Education', 'Informatics']
link: 'https://ciprep.pro'
---

## Overview

Board exam prep for Clinical Informatics is expensive ($2,000+ courses), especially for fellows. I built [CI Prep Pro](https://ciprep.pro), a commercial exam prep website, to fix that and give our specialty a high-quality question bank.

## Problem

- Fellows need affordable, quality practice to pass on their first attempt, yet prep courses cost more than many conferences

## Solution

Practice questions ($30/month) with detailed explanations, based on my fellowship and former experience working for a commercial test prep company.

## Impact

In our first year, we achieved double-digit market share through word-of-mouth and organic socials.

## Technical Details

- Tech stack: Flask, MySQL, AWS, Stripe. 80%+ function test coverage and robust pre-commit pipeline for QA
- Most difficult bug solved: `images hosted on s3 randomly don't load in admin panel`
- Most fun bug solved: debugging my first Stripe payment's API call :)
