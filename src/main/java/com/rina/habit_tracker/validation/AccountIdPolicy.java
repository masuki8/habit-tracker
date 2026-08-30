package com.rina.habit_tracker.validation;

public final class AccountIdPolicy {

    public static final int MIN_LENGTH = 3;
    public static final int MAX_LENGTH = 30;
    public static final String PATTERN = "^[a-zA-Z0-9_]{3,30}$";

    public static String normalize(String accountId) {
        return accountId.trim();
    }

    public static boolean isValid(String accountId) {
        return accountId != null && accountId.matches(PATTERN);
    }
}
