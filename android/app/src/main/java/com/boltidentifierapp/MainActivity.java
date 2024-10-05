package com.boltidentifierapp;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;
import android.os.Bundle;

import java.util.Objects;

public class MainActivity extends ReactActivity {

    @Override
    protected String getMainComponentName() {
        return "BoltIdentifierApp";
    }

    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new DefaultReactActivityDelegate(this, Objects.requireNonNull(getMainComponentName()), DefaultNewArchitectureEntryPoint.getFabricEnabled());
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(null);
    }
}
